<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\ReminderVaksinasi;
use Carbon\Carbon;

class ReminderVaksinasiNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $vaksinasi;
    protected $reminderType;

    public function __construct(ReminderVaksinasi $vaksinasi, $reminderType)
    {
        $this->vaksinasi = $vaksinasi;
        $this->reminderType = $reminderType;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $petName = $this->vaksinasi->hewan->nama_hewan ?? 'Hewan Anda';
        $jenisVaksin = $this->vaksinasi->jenisVaksin->nama_vaksin ?? '-';
        // ✅ Perbaikan: Parse tanggal_vaksin sebagai string
        $date = Carbon::parse($this->vaksinasi->tanggal_vaksin)->format('d/m/Y');

        $reminderMessages = [
            '7_day_before' => [
                'subject' => "Reminder: Vaksinasi {$jenisVaksin} dalam 7 hari",
                'intro' => "{$petName} Anda memiliki jadwal vaksinasi {$jenisVaksin} dalam 7 hari.",
            ],
            '3_days_sebelum' => [
                'subject' => "Reminder: Vaksinasi {$jenisVaksin} dalam 3 hari",
                'intro' => "{$petName} Anda memiliki jadwal vaksinasi {$jenisVaksin} dalam 3 hari.",
            ],
            'same_day' => [
                'subject' => "Reminder: Hari Vaksinasi {$jenisVaksin} - HARI INI!",
                'intro' => "Hari ini adalah jadwal vaksinasi {$jenisVaksin} untuk {$petName}!",
            ],
        ];

        $message = $reminderMessages[$this->reminderType] ?? $reminderMessages['7_day_before'];

        return (new MailMessage)
            ->subject($message['subject'])
            ->greeting("Halo {$notifiable->name}!")
            ->line($message['intro'])
            ->line("🐾 Hewan: {$petName}")
            ->line("💉 Jenis Vaksin: {$jenisVaksin}")
            ->line("📅 Tanggal: {$date}")
            ->line("Pastikan hewan Anda dalam kondisi sehat dan siap untuk vaksinasi.")
            ->action('Lihat Detail', url('/dashboard'))
            ->line("Terima kasih telah mempercayai klinik kami!");
    }
}