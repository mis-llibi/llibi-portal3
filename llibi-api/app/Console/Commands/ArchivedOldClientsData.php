<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;
use App\Services\SendingEmail;

class ArchivedOldClientsData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:archive-clients-six-months';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move rows older than 6 months to the llibiapp_portal.app_portal_clients_archive table and remove them from the llibiapp_portal.app_portal_clients table';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Define the cutoff date (6 months ago)
        $dateThreshold = Carbon::now()->subMonths(6);
        $mainTable = 'llibiapp_portal.app_portal_clients';
        $archiveTable = 'llibiapp_portal.app_portal_clients_archive';

        $this->info("Archiving records older than {$dateThreshold->toDateTimeString()}...");

        DB::beginTransaction();

        try {
            // Step 1: Copy rows older than 6 months to the archive table
            // Using a raw query relies on both tables having identical schemas
            $inserted = DB::statement(
                "INSERT INTO {$archiveTable} SELECT * FROM {$mainTable} WHERE created_at < ?",
                [$dateThreshold]
            );

            // Step 2: Delete those same rows from the main table
            $deleted = DB::table($mainTable)
                         ->where('created_at', '<', $dateThreshold)
                         ->delete();

            DB::commit();
            
            // Send an email notification about successful archiving using the custom mailer
            $view = view('send-success-archiving-clients-data', ['deletedCount' => $deleted])->render();
            $mailer = new SendingEmail(env('ARWILL'), $view, 'Success: Client Data Archived');
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