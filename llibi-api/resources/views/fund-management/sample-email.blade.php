<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>

<body>
  <p style="font-size: 14px;">Hello <strong>{{ $name }}</strong>, there's a new update regarding the transmittal document, please see adjustment(s) made below.</p>

  <table style="border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 14px;">
    <thead>
      <tr>
        <th style="border: 1px solid #ccc; padding: 8px 12px; text-align: left; background: #f4f4f4;">User</th>
        <th style="border: 1px solid #ccc; padding: 8px 12px; text-align: left; background: #f4f4f4;">Adjustment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #ccc; padding: 8px 12px;">{{ $user }}</td>
        <td style="border: 1px solid #ccc; padding: 8px 12px;">{{ $adjustment }}</td>
      </tr>
    </tbody>
  </table>

  <table style="font-size: 14px; border-collapse: collapse;">
    <tr>
      <td style="padding: 2px 12px 2px 0;"><strong>Transmittal Doc:</strong></td>
      <td style="padding: 2px 12px;">{{ $transmittal_doc }}</td>
    </tr>
    <tr>
      <td style="padding: 2px 12px 2px 0;"><strong>Code:</strong></td>
      <td style="padding: 2px 12px;">{{ $code }}</td>
    </tr>
    <tr>
      <td style="padding: 2px 12px 2px 0;"><strong>Tracking:</strong></td>
      <td style="padding: 2px 12px;">{{ $tracking }}</td>
    </tr>
  </table>

  <p style="font-size: 12px; font-style: italic;"><em>This communication, including attachments, is for the exclusive use of the addressee and may contain proprietary, confidential or privileged information. If you are not the intended recipient, any use, copying, disclosure, dissemination or distribution is strictly prohibited. If you are not the intended recipient, please notify the sender immediately by return mail and delete this communication and destroy all copies.</em></p>

  <br /><br />

  <hr>
  <footer>
    <div>
      <img src="https://llibi.app/images/lacson-logo.png" alt="LLIBI LOGO" width="200">
    </div>
    <div>
      <small style="color: gray;">&#9400; {{ date('Y') }} Lacson &amp; Lacson Insurance Brokers, Inc. | 15th Floor
        Burgundy Corporate Tower 252 Sen. Gil Puyat Ave., Makati City, 1200</small>
    </div>
    <div>
      <small style="font-weight: bold; text-transform: uppercase;">This is an auto-generated Email. Does not support
        replies.</small>
    </div>
  </footer>

</body>

</html>
