<?php

namespace Tests\Feature;

use Tests\TestCase;

class PasswordEmailTest extends TestCase
{
    public function test_password_routes_send_the_correct_email_templates()
    {
        class_alias(PasswordEmailMailerStub::class, 'App\\Services\\SendingEmail');

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
            $this->assertStringContainsString('Dear &lt;Company&gt; &amp; Partners,', $html);
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
}

class PasswordEmailMailerStub
{
    public static $sent = [];

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
    }
}
