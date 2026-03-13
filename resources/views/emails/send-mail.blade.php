<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Praktikum Pemrograman Web</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $content['subject'] }}</h1>
        </div>
        
        <div class="content">
            <p>Halo <strong>{{ $content['name'] }}</strong>,</p>
            
            <p>{{ $content['body'] }}</p>
            
            <p>Terima kasih!</p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Praktik Dokter Hewan Fanina. All rights reserved.</p>
        </div>
    </div>
</body>
</html>