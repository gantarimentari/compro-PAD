<?php


namespace App\Models;

use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotification;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, CanResetPassword;

    protected $fillable = [
        'username',
        'phone_number',
        'email',
        'password',
        'google_id',
        'role',
    ];

    public function jenisHewan(){
        return $this->hasMany(JenisHewan::class, 'id_pasien');
    }
    

    public function hewans()
    {
        return $this->hasMany(Hewan::class, 'id_pasien', 'id');
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

        /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isUser()
    {
        return $this->role === 'user';
    }
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    public function scopePatients($query)
    {
    return $query->where('role', 'user');
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordNotification($token, $this->email));
    }

}