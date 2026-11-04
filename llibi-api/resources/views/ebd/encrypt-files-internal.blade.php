<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  {{-- <title>Document</title> --}}
</head>

<body>
  <p style="font-size: 14px;">Dear Department Head,</p>

  <p style="font-size: 14px;">Below is the password for all encrypted files sent internally within Lacson &amp; Lacson Insurance Brokers, Inc. (LLIBI).</p>

  <p style="font-size: 14px;">Please use this password for all succeeding emails containing encrypted files. We will provide a new password, when necessary, in accordance with LLIBI&rsquo;s Password Management Policy.</p>

  <p style="font-size: 14px;"><strong>Password:</strong> {{ $password }}</p>

  <p style="font-size: 14px;">Please share the password only with authorized team members who need access to the files. Do not share it with anyone outside your team. Unauthorized sharing of the password may result in unauthorized access to the files and constitute a violation of LLIBI policies and applicable data protection laws.</p>

  <p style="font-size: 14px;">If you have any concerns regarding its use or wish to request a password change, please contact the InfoSec Team (<a href="mailto:security@llibi.com">security@llibi.com</a>).</p>

  <p style="font-size: 14px;">Thank you.</p>

  <p style="font-size: 12px; font-style: italic;"><em>This communication, including attachments, is for the exclusive use of the addressee and may contain proprietary, confidential or privileged information. If you are not the intended recipient, any use, copying, disclosure, dissemination or distribution is strictly prohibited. If you are not the intended recipient, please notify the sender immediately by return mail and delete this communication and destroy all copies.</em></p>

  <br /><br />

  <hr>
  <footer>
    <div>
      <img src="https://llibi.app/images/lacson-logo.png" alt="LLIBI LOGO" width="200">
    </div>
    <div>
      <small style="color: gray;">&#9400; {{ date('Y') }} Lacson & Lacson Insurance Brokers, Inc. | 15th Floor
        Burgundy Corporate Tower 252 Sen. Gil Puyat Ave., Makati City, 1200</small>
    </div>
    <div>
      <small style="font-weight: bold; text-transform: uppercase;">This is an auto-generated Email. Does not support
        replies.</small>
    </div>
  </footer>

</body>

</html>
