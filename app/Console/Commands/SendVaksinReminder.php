<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ReminderVaksinasiController;
use Illuminate\Support\Facades\Log;


class SendVaksinReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminder:vaksin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send vaccination reminders via WhatsApp';

    /**
     * Execute the console command.
     */
    public function handle()
    {
            $this->info('🔔 Starting vaccination reminder process...');
        
        try {
            // ✅ Call controller method
            $controller = app(ReminderVaksinasiController::class);
            $response = $controller->sendScheduledVaksinasi();
            
            // ✅ Get data dari JsonResponse
            $data = json_decode($response->getContent());
            
            // ✅ Check if successful
            if ($response->status() === 200) {
                $this->info('✅ Reminders sent successfully!');
                $this->info('📊 Total reminders sent: ' . $data->sent_count);

                // ✅ Display table if there are reminders
                if (!empty($data->details) && count($data->details) > 0) {
                    $headers = ['Vaksinasi ID', 'Jenis Vaksin', 'Type', 'Sent To'];
                    $rows = [];

                    foreach ($data->details as $detail) {
                        $rows[] = [
                            $detail->id_vaksinasi ?? $detail->vaksinasi_id,
                            $detail->jenis_vaksin,
                            $detail->type,
                            $detail->sent_to
                        ];
                    }

                    $this->table($headers, $rows);
                } else {
                    $this->warn('⚠️  No reminders to send today.');
                }

                Log::info('✅ Vaccination reminders sent via command', [
                    'count' => $data->sent_count
                ]);

                return Command::SUCCESS;
                
            } else {
                $this->error('❌ Failed to send reminders: ' . ($data->message ?? 'Unknown error'));
                return Command::FAILURE;
            }

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            Log::error('Command error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return Command::FAILURE;
        }
    
    }
}
