<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Founders;

class FounderTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_can_get_all_founders()
    {
        Founders::factory()->count(3)->create();

        $response = $this->getJson('/api/founders');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_founder()
    {
        $user = User::factory()->create();

        $founderData = [
            'user_id' => $user->id,
            'company_name' => 'Test Company',
            'website' => 'http://test.com',
            'industry' => 'Tech'
        ];

        $response = $this->postJson('/api/founders', $founderData);

        $response->assertStatus(201)
            ->assertJsonFragment($founderData);
    }

    public function test_can_get_a_founder()
    {
        $founder = Founders::factory()->create();

        $response = $this->getJson("/api/founders/{$founder->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['id' => $founder->id]);
    }

    public function test_can_update_a_founder()
    {
        $founder = Founders::factory()->create();

        $updateData = ['company_name' => 'Updated Company Name'];

        $response = $this->putJson("/api/founders/{$founder->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment($updateData);
    }

    public function test_can_delete_a_founder()
    {
        $founder = Founders::factory()->create();

        $response = $this->deleteJson("/api/founders/{$founder->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('founders', ['id' => $founder->id]);
    }
}
