<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;
use App\Services\SendingEmail;

class ArchivedOldRequestsData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:archive-requests-six-months';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move rows older than 6 months to the llibiapp_portal.app_portal_requests_archive table and remove them from the llibiapp_portal.app_portal_requests table';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Define the cutoff date (6 months ago)
        $dateThreshold = Carbon::now()->subMonths(6);
        $mainTable = 'llibiapp_portal.app_portal_requests';
        $archiveTable = 'llibiapp_portal.app_portal_requests_archive';

        $this->info("Archiving records older than {$dateThreshold->toDateTimeString()}...");

        DB::beginTransaction();

        try {
            $schemaColumns = DB::select(
                'SELECT TABLE_NAME, COLUMN_NAME, GENERATION_EXPRESSION
                 FROM information_schema.COLUMNS
                 WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN (?, ?)
                 ORDER BY ORDINAL_POSITION',
                ['llibiapp_portal', 'app_portal_requests', 'app_portal_requests_archive']
            );
            $sourceColumns = [];
            $archiveColumns = [];

            foreach ($schemaColumns as $column) {
                if ($column->TABLE_NAME === 'app_portal_requests') {
                    $sourceColumns[$column->COLUMN_NAME] = $column->GENERATION_EXPRESSION;
                } else {
                    $archiveColumns[$column->COLUMN_NAME] = $column->GENERATION_EXPRESSION;
                }
            }

            if (!$sourceColumns || !$archiveColumns) {
                throw new Exception('Unable to read the requests or archive table columns.');
            }

            $missingColumns = array_diff(array_keys($sourceColumns), array_keys($archiveColumns));
            if ($missingColumns) {
                throw new Exception('Archive table is missing columns: ' . implode(', ', $missingColumns));
            }

            $insertColumns = [];
            foreach ($sourceColumns as $name => $expression) {
                // Generated archive columns calculate their values from the copied base columns.
                if (!empty($archiveColumns[$name])) {
                    if (empty($expression)) {
                        throw new Exception("Cannot copy ordinary source column {$name} into a generated archive column.");
                    }
                    continue;
                }

                $insertColumns[] = '`' . str_replace('`', '``', $name) . '`';
            }

            if (!$insertColumns) {
                throw new Exception('No writable archive columns were found.');
            }
            $columnList = implode(', ', $insertColumns);

            // Step 1: Copy rows older than 6 months to the archive table
            DB::statement(
                "INSERT INTO {$archiveTable} ({$columnList}) SELECT {$columnList} FROM {$mainTable} WHERE created_at < ?",
                [$dateThreshold]
            );

            // Step 2: Delete those same rows from the main table
            $deleted = DB::table($mainTable)
                         ->where('created_at', '<', $dateThreshold)
                         ->delete();

            DB::commit();

            // Send an email notification about successful archiving using the custom mailer
            $view = view('send-success-archiving-requests-data', ['deletedCount' => $deleted])->render();
            $mailer = new SendingEmail(env('ARWILL'), $view, 'Success: Requests Data Archived');
            $mailer->send();

            $this->info("Success! Moved {$deleted} rows to the archive table.");
            return Command::SUCCESS;

        } catch (Exception $e) {
            DB::rollBack();
            $this->error("Failed to archive data: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
