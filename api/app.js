const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint to get the visit count
app.get('/', (req, res) => {
    let count = getVisitCount();
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SRM TRACKER</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7f7f7;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            color: #333;
        }
        p {
            text-align: center;
            color: #666;
        }
        button {
            display: block;
            margin: 0 auto;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }

        .center {
            display: block;
            margin-left: auto;
            margin-right: auto;
          }
    </style>
</head>
<body>
    <div class="container">
    <img src="http://127.0.0.1:5501/ic_icon.png" widhth='200px' height = '200px' class="center"></img>
        <h1>SRM TRACKER</h1>
        <form method="get" action="/download">
            <button class = "down" type="submit" name="download">Download</button>
        </form>
        
        <p id="visit" style="display: none;">This page has been visited ${count} times.</p>
        <p id="downloads" style="display: none;">This file has been downloaded ${fs.readFileSync('download_count.txt', 'utf8').trim()} times.</p>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        let count = ${count}; 

        // Check if count is greater than 20
        if (count > 20) {
            // Show the visit count paragraph
            document.getElementById('visit').style.display = 'block';
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        let count = ${fs.readFileSync('download_count.txt', 'utf8').trim()}; 

        // Check if count is greater than 20
        if (count > 20) {
            // Show the visit count paragraph
            document.getElementById('downloads').style.display = 'block';
        }
    });
</script>
    
</body>
</html>
`);
});




// Function to get the visit count from file
function getVisitCount() {
    try {
        // Read the visit count from file
        let count = parseInt(fs.readFileSync('visit_count.txt', 'utf8'));
        // Increment the count
        count++;
        // Write the updated count back to file
        fs.writeFileSync('visit_count.txt', count.toString());
        return count;
    } catch (err) {
        // If file does not exist or error occurs, return count as 1
        fs.writeFileSync('visit_count.txt', '1');
        return 1;
    }
}

app.get('/inApp', (req, res) => {
    let count = getDownCount();
    console.log(count);
    let v = getVisitCount();

    
    // Increment download count or handle count logic

    // Serve the file for download
    const filePath = path.join(__dirname, 'SRMTracker.apk');
    res.download(filePath, 'SRMTracker.apk', (err) => {
        if (err) {
            // Handle error
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
        } else {
            // File successfully sent
            console.log('File sent successfully');
        }
    });
});

app.get('/download', (req, res) => {
    let count = getDownCount();
    console.log(count);
    
    // Increment download count or handle count logic

    // Serve the file for download
    const filePath = path.join(__dirname, 'app-release.apk');
    res.download(filePath, 'app-release.apk', (err) => {
        if (err) {
            // Handle error
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file');
        } else {
            // File successfully sent
            console.log('File sent successfully');
        }
    });
});

app.get('/reset', (req, res) => {
    fs.writeFileSync('download_count.txt', "0");
    fs.writeFileSync('visit_count.txt', "0");
});

function getDownCount() {
    try {
        // Read the visit count from file
        let count = parseInt(fs.readFileSync('download_count.txt', 'utf8'));
        // Increment the count
        count++;
        // Write the updated count back to file
        fs.writeFileSync('download_count.txt', count.toString());
        return count;
    } catch (err) {
        // If file does not exist or error occurs, return count as 1
        fs.writeFileSync('download_count.txt', '1');
        return 1;
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
