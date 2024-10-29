<?php

namespace App\Console\Commands\self_enrollment\deel;

use Illuminate\Console\Command;

use App\Models\NotificationStatus;
use App\Models\Self_enrollment\members;
use App\Models\Self_enrollment\contact;
use App\Models\Self_enrollment\attachment;

use App\Http\Controllers\Self_enrollment\ManageDeelNotifications;

use App\Http\Controllers\NotificationController;

use Illuminate\Support\Facades\DB;


class sendWelcomeEmailForApprovedClients extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:send-welcome-email-for-approved-clients';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $list = DB::table('self_enrollment_members as t1')
            ->join('self_enrollment_contact as t2', 't1.id', '=', 't2.link_id')
            ->select(
                't1.id',
                't1.is_renewal',
                't1.vendor',
                't1.member_id',
                't1.last_name',
                't1.first_name',
                't1.hash',
                't1.upload_date',
                't1.status',
                't1.form_locked',
                't2.email',
                't2.email2',
                't2.mobile_no'
            )
            ->whereIn('t1.status', [6])
            //->whereIn('t1.member_id', ['3xxnqgy'])
            ->where('client_company', 'DEEL')
            ->where('t1.relation', 'PRINCIPAL')
            //->limit(5)
            ->orderBy('t1.id', 'DESC')
            ->get();

        $notificationTitle = 'No Reminders For Sending...';
        $notification = [];

        $app = 'SELF-ENROLLMENT';
        $clientCompany = 'DEEL';
        //check if there is still enrollee needs to be reminded
        if (count($list) > 0) {

            foreach ($list as $key => $row) {

                $exist = NotificationStatus::where('app', $app)
                    ->where('client_id', $row->id)
                    ->where('client_company', $clientCompany)
                    ->whereIn('status', [
                        'SEND WELCOME EMAIL: APPROVED ENROLLMENT',
                    ])
                    ->where('date', date('Y-m-d'))
                    ->exists();

                $info = [
                    'hash'       => $row->hash,
                    'member_id'  => $row->member_id,
                    'name'       => $row->last_name . ', ' . $row->first_name,
                    'email'      => $row->email, //'markimperial@llibi.com',
                    'email2'     => $row->email2, //'mc_cimperial@yahoo.com',
                    'mobile'     => $row->mobile_no,
                    'vendor'     => $row->vendor,
                    'is_renewal' => $row->is_renewal,
                ];

                if (!$exist) {

                    $notificationTitle = 'Approved: Welcome Email';
                    $notification[] = [
                        'Message' => 'Notification Sent',
                        'to' => $info
                    ];

                    //check if there is notification set on that day
                    $this->approvedWelcomeEmail($info);

                    //$status = 0;
                    $status = 'SEND WELCOME EMAIL: APPROVED ENROLLMENT';

                    if ($status != 0)
                        NotificationStatus::create([
                            'app' => $app,
                            'client_id' => $row->id,
                            'client_company' => $clientCompany,
                            'status' => $status,
                            'date' => date('Y-m-d')
                        ]);
                }
            }
        }

        dd([$notificationTitle => $notification]);
    }

    public function approvedWelcomeEmail($info)
    {
        $clients = members::where('member_id', $info['member_id'])
            ->where('skip_hierarchy', '!=', 1)
            ->orderBy('id', 'ASC')
            ->get(['last_name', 'first_name', 'middle_name', 'relation', 'certificate_no']);

        $mailMsg = array(
            'body' => view('self-enrollment/send-welcome-email-for-approved-clients', [
                'subject' => 'DEEL WELCOME EMAIL NOTIFICATION',
                'clients' => $clients,
                'provider' => ucwords(strtolower($info['vendor'])),
                'provider_email' => $info['vendor'] == 'PHILCARE' ? 'callcenter@philcare.com.ph' : 'callcenter@maxicare.com.ph',
            ]),
            'attachment' => ['public/Self_enrollment/Deel/Welcome_attachments/BENEFIT FLYER 1.pdf', 'public/Self_enrollment/Deel/Welcome_attachments/BENEFIT FLYER 2.pdf'],
            'subject' => 'DEEL WELCOME EMAIL NOTIFICATION',
            'bcc' =>  'deelrenewal@llibi.com',
            'name' => 'Deel Renewal',
        );

        if (!empty($info['email'])) (new NotificationController)
            ->MailNotification($info['name'], $info['email'], $mailMsg);

        if (!empty($info['email2'])) (new NotificationController)
            ->MailNotification($info['name'], $info['email2'], $mailMsg);
    }
}
