<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('founders', function (Blueprint $table) {
        $table->id();
       // $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('company_name')->nullable();
        $table->string('sector')->nullable(); // Changed from 'industry' to 'sector'
        $table->string('location')->nullable(); // New field
        $table->enum('funding_stage', [
            'pre-seed', 
            'seed', 
            'series A', 
            'series B', 
            'series C', 
            'IPO'
        ])->nullable();
        $table->enum('valuation', [
            'pre-seed', 
            'seed', 
            'series A', 
            'series B', 
            'series C', 
            'IPO'
        ])->nullable(); // New field
        $table->string('years_of_establishment')->nullable(); // Renamed from 'years of establishment'
        $table->decimal('funding_amount', 15, 2)->nullable();
        $table->text('description')->nullable();
        $table->string('file_path')->nullable();
        $table->string('status')->default('pending');
        $table->enum('number_of_employees', [ // Renamed from 'number of employees'
            '1-10', 
            '11-50', 
            '51-200', 
            '201-500', 
            '501-1000', 
            '1001+'
        ])->nullable(); // New field
        $table->timestamps();
        
        // Optional: Add index for better performance
        //$table->index('user_id');
        $table->index('sector');
        $table->index('funding_stage');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('founders');
    }
};
