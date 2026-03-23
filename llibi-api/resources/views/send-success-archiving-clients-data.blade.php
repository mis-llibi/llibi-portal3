<!DOCTYPE html>
<html>
<head>
    <title>Archive Cron Job Success - Clients Data</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #28a745;">Cron Job Execution Successful</h2>
        <p>The automated archiving process for <strong>app_portal_clients</strong> has completed successfully.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date of Execution:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">{{ \Carbon\Carbon::now()->format('Y-m-d H:i:s') }}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Records Archived & Cleaned:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">{{ $deletedCount ?? 'N/A' }} rows</td>
            </tr>
        </table>

        <p style="margin-top: 20px; font-size: 0.9em; color: #666;">This is an automated system notification. No further action is required.</p>
    </div>
</body>
</html>
