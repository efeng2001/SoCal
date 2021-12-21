<!DOCTYPE html>
<html>
	<head>
		<title>Profile</title>

		<meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

        <!-- Font imports -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">

		<!-- Custom styling imports -->
		<link rel="stylesheet" href="css/styles.css">
		<link rel="stylesheet" href="css/profile.css">
		
		<!-- import the javascript functions -->
		<script src="js/functions.js?1"></script>
	</head>
	<body>
	
		<!-- stores the user email -->
		<div style="display:none" id="hidden-email">
			<%=request.getParameter("email")%>
		</div>
    	
    	<!-- Navigation bar -->
    	<div class="navBar">
    		SoCal
    	</div>
    	<!-- Spacer - NEEDED FOR ALL PAGES -->
    	<div class="navBarSpacer"></div>

    	<!-- Footer bar -->
    	<div class="footer">
    		<div class="footerIconContainer homeIconContainer">
    			<a href="index.html"><img class="iconImage" src="images/icons/calendar.png" /></a>
    		</div>
    		<div class="footerIconContainer profileIconContainer">
    			<a href="profile.jsp" id="profileLink"><img class="iconImage" src="images/icons/profile.png" /></a>
    		</div>
    		<div class="footerIconContainer cameraIconContainer">
    			<a onclick="openScanner()"><img class="iconImage" src="images/icons/camera.png" /></a>
    		</div>
    		<div class="footerIconContainer qrIconContainer">
    			<a onclick="openQR()"><img class="iconImage" src="images/icons/qr.png" /></a>
    		</div>
    		<div class="footerIconContainer mapIconContainer">
    			<a href="map.html"><img class="iconImage" src="images/icons/map.png" /></a>
    		</div>
	    </div>

    	<!-- page specific content starts here -->
    	
    	<!-- displays the profile image and username -->
    	<div class="profileBar">
    		<!-- profile image, has a default image until we read in the user data and set it using javascript -->
    		<div id="profileImageContainer">
    			<img id="profileImage" src="images/icons/profile-black.png" />
    		</div>
    		<!-- username, placeholder username for now until we read in the user data and set it using javascript -->
    		<div id="username">
    			noah.klm
    		</div>
    		<!-- friend count, will be updated when we read in the user data nad set it usng javascript -->
    		<div id="friendCount">
    			87
    		</div>
    		<div class="friendsLabel">Friends</div>
    	</div>

    	<!-- overflowing, scrollable list of all friends -->
    	<!-- will be filled out dynamically using javascript once we read in the data, this is just the hmtl template -->
    	<div id="friendsListContainer"></div>

	</body>
	<script>
		getInitData("Profile");
	</script>
</html>
