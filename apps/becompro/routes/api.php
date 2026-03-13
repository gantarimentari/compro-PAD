<?php

use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\UserProfileController;

use App\Http\Controllers\WhatsappController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\JenisHewanController;
use App\Http\Controllers\HewanController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\SystemInfoController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PublicPromoController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\ReminderVaksinasiController;

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/media', [MediaController::class, 'index']);
Route::get('/media/statistics', [MediaController::class, 'statistics']);
Route::get('/public/promos', [PublicPromoController::class, 'index']);
Route::get('/system-info', [SystemInfoController::class, 'index']);
Route::withoutMiddleware([
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class
])->group(function () {
    Route::post('/whatsapp/send', [WhatsappController::class, 'send']);
});

 Route::get('/reminder-vaksinasi', [ReminderVaksinasiController::class, 'index']);
    Route::post('/reminder-vaksinasi', [ReminderVaksinasiController::class, 'store']);
    Route::put('/reminder-vaksinasi/{id}', [ReminderVaksinasiController::class, 'update']);
    Route::delete('/reminder-vaksinasi/{id}', [ReminderVaksinasiController::class, 'destroy']);

require __DIR__. '/auth.php';

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/media', [MediaController::class, 'store']);
    Route::delete('/media/{id}', [MediaController::class, 'destroy']);

    Route::apiResource('articles', ArticleController::class)->except('index');

    Route::apiResource('jenis-hewan', JenisHewanController::class);
    Route::apiResource('hewan', HewanController::class);
    Route::apiResource('patients',PatientController::class);

    Route::apiResource('reservations', ReservationController::class);
    Route::patch('reservations/{reservation}/status', [ReservationController::class, 'updateStatus']);

    Route::apiResource('promos', PromoController::class);

    Route::put('/system-info', [SystemInfoController::class, 'update']);
    
    Route::get('/social-media', [SystemInfoController::class, 'getSocialMedia']);
    Route::post('/social-media', [SystemInfoController::class, 'storeSocialMedia']);
    Route::put('/social-media/{social_media}', [SystemInfoController::class, 'updateSocialMedia']);
    Route::delete('/social-media/{social_media}', [SystemInfoController::class, 'deleteSocialMedia']);

    // Amanajemen admin
    Route::apiResource('admins', AdminController::class);

    Route::get('/dashboard/statistics', [DashboardController::class, 'getStatistics']);
    Route::get('/dashboard/clinic-summary', [DashboardController::class, 'getClinicSummary']);
    Route::get('/dashboard/recent-transactions', [DashboardController::class, 'getRecentTransactions']);

    // Manual trigger reminder
    Route::post('/reminder-vaksinasi/send-manual', [ReminderVaksinasiController::class, 'sendManualReminder']);
    
    // Get reminder logs
    Route::get('/reminder-vaksinasi/logs', [ReminderVaksinasiController::class, 'getReminderLogs']);
    
    // Trigger scheduled reminders manually
    Route::post('/reminder-vaksinasi/send-scheduled', [ReminderVaksinasiController::class, 'sendScheduledVaksinasi']);
});


Route::middleware(['auth:sanctum'])->group(function () {
    // Get current user
    Route::get('/user', function (Request $request) {
        return response()->json(['user'=>$request->user()]);
    });

    // Profile endpoints
    Route::get('/profile', [UserProfileController::class, 'show']);
    Route::put('/profile', [UserProfileController::class, 'update']);
    Route::put('/profile/password', [UserProfileController::class, 'updatePassword']);

    // Route::get('/reminder-vaksinasi', [ReminderVaksinasiController::class, 'index']);
    // Route::post('/reminder-vaksinasi', [ReminderVaksinasiController::class, 'store']);
    // Route::put('/reminder-vaksinasi/{id}', [ReminderVaksinasiController::class, 'update']);
    // Route::delete('/reminder-vaksinasi/{id}', [ReminderVaksinasiController::class, 'destroy']);
});
