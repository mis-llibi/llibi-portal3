<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  {{-- <title>Document</title> --}}
</head>

<body style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
  Hi <b>{{ $name }},</b>
  <br /><br />

  {!! $statusRemarks !!}
  <br /><br />

  For further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.<br /><br />
  <b>LACSON AND LACSON INSURANCE BROKERS, INC.</b><br />
  Manila Line: (02) 8236-6492<br />
  Mobile number for Calls Only:<br />
  0917-8055424<br />
  0917-8855424<br />
  0919-0749433<br />

  Email: clientcare@llibi.com<br /><br />

  Your reference number is <b>{{ $ref }}</b>.
  <br />
  <br />

  <span style="font-weight: bold; color: red;">
    CONFIDENTIALITY STATEMENT
  </span>
  <br>
  <span style="font-style: italic;">
    This email contains confidential and sensitive personal information and is intended only for the recipient who
    made
    the LOA request. If we sent this to you by error, please let us know and destroy all copies of this email and
    attachments. Do not reproduce or disseminate any part of this email and its attachments to any unintended
    recipients.
  </span>
  <br />

  <br />
  {!! $feedbackLink !!}

  <p>
    This email is sent by Lacson and Lacson Insurance Brokers, Inc.
    <br>
    Address: 15th Floor Burgundy Corporate Tower 252 Sen. Gil Puyat Ave., Makati City
  </p>

  <b>This is an auto-generated Email. Doesn’t support replies and calls.</b>
</body>

</html>
