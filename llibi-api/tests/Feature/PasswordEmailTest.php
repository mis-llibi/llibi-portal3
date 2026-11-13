<?php

namespace Tests\Feature;

use Tests\TestCase;

class PasswordEmailTest extends TestCase
{
    public function test_password_routes_send_the_correct_email_templates()
    {
        if (!class_exists('App\\Services\\SendingEmail', false)) {
            class_alias(PasswordEmailMailerStub::class, 'App\\Services\\SendingEmail');
        }
        PasswordEmailMailerStub::$sent = [];
        PasswordEmailMailerStub::$result = true;

        foreach ([
            'send-email-password' => ['ebd.encrypt-files', 'Dear Client,'],
            'send-email-password-internal' => ['ebd.encrypt-files-internal', 'Dear Department Head,'],
        ] as $endpoint => [$template, $greeting]) {
            $password = '<test-password>&';
            $this->postJson('/api/ebdencrypt/' . $endpoint, [
                'email' => 'test@example.com',
                'password' => $password,
                'cc' => 'first@example.com,second@example.com',
            ])->assertNoContent();

            $sent = end(PasswordEmailMailerStub::$sent);
            $this->assertSame('test@example.com', $sent->email);
            $this->assertSame($template, $sent->body->name());
            $this->assertSame('LLIBI PASSWORD', $sent->subject);
            $this->assertSame(['first@example.com', 'second@example.com'], $sent->cc);
            $html = $sent->body->render();
            $this->assertStringContainsString($greeting, $html);
            $this->assertStringContainsString('&lt;test-password&gt;&amp;', $html);
            $this->assertStringNotContainsString($password, $html);
        }
        $this->assertCount(2, PasswordEmailMailerStub::$sent);

        foreach (['send-email-password', 'send-email-password-internal'] as $endpoint) {
            $this->postJson('/api/ebdencrypt/' . $endpoint, [
                'email' => 'test@example.com',
                'password' => 'samplepass',
                'company' => '<Company> & Partners',
            ])->assertNoContent();

            $sent = end(PasswordEmailMailerStub::$sent);
            $html = $sent->body->render();
            $greeting = $endpoint === 'send-email-password-internal'
                ? 'Dear &lt;Company&gt; &amp; Partners Head,'
                : 'Dear &lt;Company&gt; &amp; Partners,';
            $this->assertStringContainsString($greeting, $html);
            $this->assertStringNotContainsString('<Company>', $html);
        }

        $this->postJson('/api/ebdencrypt/send-email-password', [
            'email' => 'test@example.com',
            'password' => 'samplepass',
            'company' => '',
        ])->assertNoContent();
        $sent = end(PasswordEmailMailerStub::$sent);
        $this->assertStringContainsString('Dear Client,', $sent->body->render());

        $this->postJson('/api/ebdencrypt/send-email-password-internal', [
            'email' => 'test@example.com',
            'password' => 'samplepass',
            'company' => '',
        ])->assertNoContent();
        $sent = end(PasswordEmailMailerStub::$sent);
        $this->assertStringContainsString('Dear Department Head,', $sent->body->render());
    }

    public function test_fund_management_email_sending_and_validation()
    {
        if (!class_exists('App\\Services\\SendingEmail', false)) {
            class_alias(PasswordEmailMailerStub::class, 'App\\Services\\SendingEmail');
        }
        PasswordEmailMailerStub::$sent = [];
        PasswordEmailMailerStub::$result = true;

        $endpoint = '/api/fund-management/send-email';
        $this->postJson($endpoint, [
            'email' => 'test@example.com',
            'company' => '<Company> & Partners',
            'cc' => 'first@example.com, second@example.com',
        ])->assertNoContent();

        $sent = end(PasswordEmailMailerStub::$sent);
        $this->assertSame('test@example.com', $sent->email);
        $this->assertSame('LLIBI FUND MANAGEMENT - SAMPLE EMAIL', $sent->subject);
        $this->assertSame(['first@example.com', 'second@example.com'], $sent->cc);
        $this->assertSame('fund-management.sample-email', $sent->body->name());
        $html = $sent->body->render();
        $this->assertStringContainsString('Dear Client,', $html);
        $this->assertStringNotContainsString('&lt;Company&gt; &amp; Partners', $html);
        $this->assertStringNotContainsString('<Company>', $html);
        $this->assertStringContainsString('The final email content will be provided once available.', $html);

        foreach ([['email' => 'test@example.com'], ['email' => 'test@example.com', 'cc' => '']] as $payload) {
            $this->postJson($endpoint, $payload)->assertNoContent();
            $sent = end(PasswordEmailMailerStub::$sent);
            $this->assertSame([], $sent->cc);
            $this->assertStringContainsString('Dear Client,', $sent->body->render());
        }

        $sentCount = count(PasswordEmailMailerStub::$sent);
        foreach ([
            [[], 'email'],
            [['email' => 'invalid'], 'email'],
            [['email' => ['test@example.com']], 'email'],
            [['email' => 'test@example.com', 'cc' => ['first@example.com']], 'cc'],
            [['email' => 'test@example.com', 'cc' => 'first@example.com,invalid'], 'cc'],
        ] as [$payload, $field]) {
            $this->postJson($endpoint, $payload)->assertUnprocessable()->assertJsonValidationErrors($field);
        }
        $this->assertCount($sentCount, PasswordEmailMailerStub::$sent);

        PasswordEmailMailerStub::$result = false;
        try {
            $this->postJson($endpoint, ['email' => 'test@example.com'])->assertStatus(502);
        } finally {
            PasswordEmailMailerStub::$result = true;
        }
    }
}

class PasswordEmailMailerStub
{
    public static $sent = [];
    public static $result = true;

    public function __construct(
        public $email = null,
        public $body = null,
        public $subject = null,
        public $key = 'default',
        public $attachments = [],
        public $cc = [],
        public $bcc = []
    ) {
    }

    public function sendLlibiBenAd()
    {
        self::$sent[] = $this;
        return self::$result;
    }
}
