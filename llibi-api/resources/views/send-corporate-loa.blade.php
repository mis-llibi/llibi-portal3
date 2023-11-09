<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  {{-- <title>Document</title> --}}
</head>

<body style="font-family:Arial, Helvetica, sans-serif;">
  <p style="font-weight:normal;">
    Hi <b>{{ $first_name }},</b>
    <br /><br />

    Your LOA request is <b>approved</b>. Please print a copy LOA and present to the accredited provider upon
    availment.
    <br /><br />

    For further inquiry and assistance, feel free to contact us through our 24/7 Client Care Hotline.<br /><br />
    <b>LACSON AND LACSON INSURANCE BROKERS, INC.</b><br />
    Manila Line: (02) 8236-6492<br />
    Mobile number for Calls Only:<br />
    0917-8055424<br />
    0917-8855424<br />
    0919-0749433<br />

    Email: clientcare@llibi.com<br /><br />

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
  <div>
    <div>
      We value your feedback: <a href="{{ $feedback_url }}">
        Please click here
      </a>
    </div>
    <div>
      <a href="{{ $feedback_url }}">
        <img src="{{ $homepage }}/storage/ccportal_1.jpg" alt="Feedback Icon" width="300">
      </a>
    </div>
  </div>
  <br /><br />

  <hr>
  <footer>
    <div>
      <img src="https://llibi.app/company-images/llibi_logo.png" alt="LLIBI LOGO" width="200">
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
