<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>

<body>
    <main>
        Dear Member, <br /><br />

        Good day! <br /><br />

        <p>
            We are pleased to inform that your healthcare (HMO) plan membership under {{ $provider }} (and arranged through Lacson &
            Lacson Insurance Brokers, Inc.) is already <strong>active</strong> effective November 1, 2024.
        </p>

        <table style='background-color:#333;'>
            <thead>
                <tr>
                    <th style='background-color:#E1E1E1;width:100px;padding:4px;'>Member Type</th>
                    <th style='background-color:#E1E1E1;width:100px;padding:4px;'>Last Name</th>
                    <th style='background-color:#E1E1E1;width:100px;padding:4px;'>First Name</th>
                    <th style='background-color:#E1E1E1;width:100px;padding:4px;'>Middle Name</th>
                    <th style='background-color:#E1E1E1;width:100px;padding:4px;'>Certificate No.</th>
                    <!--  <th style='background-color:#E1E1E1;width:100px;padding:4px;'>Start of Coverage</th> -->
                </tr>
            </thead>
            <tbody>
                @foreach ($clients as $row)
                <tr>
                    <td style="background-color:#fafafa;padding:4px;">
                        {{ $row['relation'] == 'PRINCIPAL' ? 'Principal' : 'Dependent' }}
                    </td>
                    <td style="background-color:#fafafa;padding:4px;">
                        {{ ucwords(strtolower($row['last_name'])) }}
                    </td>
                    <td style="background-color:#fafafa;padding:4px;">
                        {{ ucwords(strtolower($row['first_name'])) }}
                    </td>
                    <td style="background-color:#fafafa;padding:4px;">
                        {{ ucwords(strtolower($row['middle_name'])) }}
                    </td>
                    <td style="background-color:#fafafa;padding:4px;">{{ $row['certificate_no'] }}</td>
                    <!-- <td style="background-color:#fafafa;padding:4px;">{{ $row['coverage_date'] }}</td> -->
                </tr>
                @endforeach
            </tbody>
        </table>

        <br>
        <br>

        <p>
            For existing members, your {{ $provider }} membership card is reactivated and may be used for availment. {{ $provider }} will not issue new membership cards.</p>

        <p>
            For new members, {{ $provider }} membership card will be delivered to your home address within 2-3 weeks upon receiving this notification. In the meantime, you may present your certificate number to {{ $provider }}’s accredited facilities, along with a valid ID, in order to make a claim while awaiting for your physical card. </p>

        <p>
            For new members with “Pending” status, you will receive another email notification from Lacson & Lacson with instruction to complete your enrollment requirement submission. </p>

        <p>
            To offer more convenient and accessible healthcare services and to view your <b>virtual or digital card</b>, you may download {{ $provider }}’s Hey Phil mobile application. Below is the process and infographics are attached for further details. </p>

        <p>
            <b>1) Download the App</b><br />
            • Search ‘Hey Phil’ available in Google Play store or in App Store<br />
            • Create Hey Phil account through registration.
        </p>

        <p>
            <b>2) Manual Registration</b><br />
            • Key in certificate number<br />
            • Click ‘verify’ to register
        </p>

        <p>
            <b>3) Facebook Registration</b><br />
            • Once certificate number and birthdate has been verified, select ‘Continue with Facebook’<br />
            • Key in Facebook credentials such as username and password
        </p>

        <p>For any medical availment inquiries, you may contact {{ $provider }}’s 24/7 Customer Hotline at (02) 8462-1800 or email <a href="mailto:{{ $provider_email }}">{{ $provider_email }}</a>.</p>

        <p>Please refer to the attached benefits flyer for an overview of your coverage.</p>

        <p>You may also refer to the pre-recorded <a href="https://philcare-my.sharepoint.com/:p:/g/personal/flor_diga_philcare_com_ph/EbBry6rioD5ImiDYke-1wW4BZm5N4jHrKpg1etXv7QN41Q?rtime=0zuPvGXy3Eg">video presentation</a> for an in-depth presentation of your benefits, policy exclusion and availment process.</p>

        <p>Should you require additional assistance, you may also contact Lacson & Lacson Insurance Brokers, Inc.</p>

        <b>Beatrice Abesamis</b><br />
        Corporate Accounts Executive<br />
        Email: <a href='mailto:beatriceabesamis@llibi.com'>beatriceabesamis@llibi.com</a><br />
        Mobile: 0917-8795928<br /><br />

        <b>Louie Jane Padua</b><br />
        Manager - Corporate Account Executive <br />
        Email: <a href='mailto:louiepadua@llibi.com'>louiepadua@llibi.com</a><br />
        Mobile: 0917-5017637 <br /><br />
    </main>

    <br />
    <br />

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