<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use App\Http\Controllers\Self_enrollment\ManageBroadpathEnrollee;
use Illuminate\Support\Facades\Storage;

class Kernel extends ConsoleKernel
{
  /**
   * Define the application's command schedule.
   *
   * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
   * @return void
   */
  protected function schedule(Schedule $schedule)
  {
    $schedule->call(function () {
      $dateToday = '2023-04-02'; //date('Y-m-d');
      $dateFinalWarning = '2023-04-05';
      $dateFormLocked = '2023-04-06';

      $reminder = (new ManageBroadpathEnrollee)->checkReminders($dateToday, $dateFinalWarning, $dateFormLocked);
    })->dailyAt('12:24');

    $schedule->command('send:pending-not-moving')->everyMinute();
    $schedule->call(function() {
      Storage::deleteDirectory('public/manual/upload/loa');
    })->everyMinute();
  }

  /**
   * Register the commands for the application.
   *
   * @return void
   */
  protected function commands()
  {
    $this->load(__DIR__ . '/Commands');

    require base_path('routes/console.php');
  }
}
