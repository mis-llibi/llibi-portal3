<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  {{-- <title>Document</title> --}}
</head>

<body style="font-family:Arial, Helvetica, sans-serif;">
  <p>Hello</p>

  <a
    href="{{ env('FRONTEND_URL') }}/feedback/manual?q={{ $q }}&member_id={{ $member_id }}&company_code={{ $company_code }}">
    {{ env('FRONTEND_URL') }}/feedback/manual?q={{ $q }}&member_id={{ $member_id }}&company_code={{ $company_code }}
  </a>
</body>

</html>
