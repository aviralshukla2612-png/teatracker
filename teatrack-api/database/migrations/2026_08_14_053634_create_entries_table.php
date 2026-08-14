<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entries', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique();
            $table->unsignedInteger('tea_quantity')->default(0);
            $table->unsignedInteger('coffee_quantity')->default(0);
            $table->unsignedInteger('total_cups')->default(0);
            $table->decimal('tea_rate', 10, 2);
            $table->decimal('coffee_rate', 10, 2);
            $table->decimal('tea_expense', 10, 2)->default(0);
            $table->decimal('coffee_expense', 10, 2)->default(0);
            $table->decimal('total_expense', 10, 2)->default(0);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entries');
    }
};
