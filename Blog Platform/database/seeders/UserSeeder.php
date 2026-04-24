<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                "name" => "Mohammad Falah",
                "email" => "mohammadfalah@gmail.com",
                "password" => "2Wnjskqmm!",
                "role" => "admin"
            ],
            [
                "name" => "Shahd",
                "email" => "shahd@gmail.com",
                "password" => "123456789"
            ]
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
