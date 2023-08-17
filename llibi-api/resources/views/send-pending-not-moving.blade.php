<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  {{-- <title>Document</title> --}}
</head>

<body style="font-family:Arial, Helvetica, sans-serif;">
  <p>Request for {{ $lastName ?? '' }}, {{ $firstName ?? '' }} has not been attended for more than 15 minutes.</p>
  {{-- <p>Hi Ms. Phoebes</p> --}}
  {{-- <p>Here's some person not moving his/her status.</p>
  <ul>
    <li>Member Id: {{ $memberID ?? '' }}</li>
    <li>Reference No.: {{ $refno ?? '' }}</li>
    <li>Name: {{ $lastName ?? '' }}, {{ $firstName ?? '' }}</li>
    <li>Contact: {{ $contact ?? '' }}</li>
    <li>Email: {{ $email ?? '' }}</li>
    <li>Company: {{ $company_name ?? '' }}</li>
  </ul> --}}
</body>

</html>
