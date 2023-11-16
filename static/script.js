// static/script.js
$(document).ready(function () {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    // new messages
    socket.on('new_message', function (data) {
        $('#chat').append('<p><strong>' + data.username + ':</strong> ' + data.message + '<br><span class="timestamp">' + data.timestamp + '</span></p>');
    });

    // chat clearing
    socket.on('clear_chat', function (data) {
        $('#chat').empty();
        // Display the chat cleared message
        $('#chat').append('<p class="system-message"><strong>' + data.username + ' cleared the chat at ' + data.timestamp + '</strong></p>');
    });

    $('#message-form').submit(function (e) {
        e.preventDefault();

        var username = $('#username').val();
        var message = $('#message').val();

        $.ajax({
            type: 'POST',
            url: '/send',
            data: { 'username': username, 'message': message },
            success: function (response) {
                console.log(response);
                $('#message').val('');
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    // Function to handle chat clearing
    $('#clear-chat').click(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/clear_chat',
            // Pass the username to the server
            data: { 'username': $('#username').val() },
            success: function (response) {
                console.log(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

    // Event listener for changes in the color scheme selector
    $('#color-scheme').change(function () {
        // Get the selected color scheme value
        var selectedColorScheme = $(this).val();

        // Update CSS variables based on the selected color scheme
        updateColorScheme(selectedColorScheme);
    });

    // Function to update CSS variables based on the selected color scheme
    function updateColorScheme(colorScheme) {
        // Define CSS variable values for each color scheme
        var colorVariables = {
            'Ocean Blue': {
                '--primary-color': '#3498db',
                '--hover-color': '#2980b9',
                '--background-color': '#f4f4f4',
                '--text-color': '#333',
                '--link-color': 'var(--primary-color)',
                '--link-hover-color': 'var(--hover-color)',
                '--system-message-color': '#e74c3c',
            },
            'Sunset Red': {
                '--primary-color': '#e74c3c',
                '--hover-color': '#c0392b',
                '--background-color': '#f5e0d8',
                '--text-color': '#333',
                '--link-color': 'var(--primary-color)',
                '--link-hover-color': 'var(--hover-color)',
                '--system-message-color': '#3498db',
            },
            'Forest Green': {
                '--primary-color': '#2ecc71',
                '--hover-color': '#27ae60',
                '--background-color': '#27ae60',  // More intense green background
                '--text-color': '#333',
                '--link-color': 'var(--primary-color)',
                '--link-hover-color': 'var(--hover-color)',
                '--system-message-color': '#3498db',
            },
            'Bubblegum Pink': {
                '--primary-color': '#e91e63',
                '--hover-color': '#c2185b',
                '--background-color': '#f8bbd0',
                '--text-color': '#333',
                '--link-color': 'var(--primary-color)',
                '--link-hover-color': 'var(--hover-color)',
                '--system-message-color': '#3498db',
            },
            'Canary Yellow': {
                '--primary-color': '#f1c40f',
                '--hover-color': '#f39c12',
                '--background-color': '#fcf3cf',
                '--text-color': '#333',
                '--link-color': 'var(--primary-color)',
                '--link-hover-color': 'var(--hover-color)',
                '--system-message-color': '#3498db',
            },
        };

        // Apply the selected color scheme by setting CSS variables
        var selectedColorSchemeVars = colorVariables[colorScheme];
        for (var variable in selectedColorSchemeVars) {
            document.documentElement.style.setProperty(variable, selectedColorSchemeVars[variable]);
        }
    }

    // Initialize with the default color scheme
    updateColorScheme('Ocean Blue');

    // Function to refresh the chat content
    function refreshChat() {
        $.ajax({
            type: 'GET',
            url: '/get_messages',
            success: function (response) {
                // Clear the existing chat content
                $('#chat').empty();
                
                // Append the updated messages to the chat container
                for (var i = 0; i < response.length; i++) {
                    var msg = response[i];
                    $('#chat').append('<p><strong>' + msg.username + ':</strong> ' + msg.message + '<br><span class="timestamp">' + msg.timestamp + '</span></p>');
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    // Refresh the chat every 5 seconds
    setInterval(refreshChat, 500);

    // additional code goes under this line

});