//inserts all the data into the html pages
function initHomePageContent(initData){
	
	console.log(initData);
	
	//set the public events
	var events = initData["events"];
	var eventsHtmlString = "";
	
	//create the events html to be inserted
	for(i = 0; i < events.length; i++){
		eventsHtmlString += "<div style='width:33.3%; float:left;'><strong style='color:#a31833; font-size:18px;'>" + events[i]["name"] + "</strong> <br>" + events[i]["start_time"] + " - " + events[i]["end_time"] + "<br><strong>Location</strong>: " + events[i]["location"] + "</div>";
	}
	
	document.getElementById("events").innerHTML = eventsHtmlString;
	
	//set the qr code image src
				var qrImageURL = initData["user"]["QRCodeURL"];
			
	//set the image url
	document.getElementById("userQRCodeImage").src = "images/" + qrImageURL;
	
	var personalEvents = initData["personalCalendar"];
	
	var calPersonalEvents = [];
	
	for(i = 0; i < personalEvents.length; i++){
		calPersonalEvents[i] = {};
		calPersonalEvents[i]["id"] = personalEvents[i]["id"];
		calPersonalEvents[i]["calendarId"] = 1;
		calPersonalEvents[i]["title"] = personalEvents[i]["name"];
		calPersonalEvents[i]["category"] = "time";
		calPersonalEvents[i]["dueDateClass"] = "";
		calPersonalEvents[i]["start"] = personalEvents[i]["start_time"];
		calPersonalEvents[i]["end"] = personalEvents[i]["end_time"];
		calPersonalEvents[i]["bgColor"] = "#a31833";
		calPersonalEvents[i]["color"] = "white";
		calPersonalEvents[i]["borderColor"] = "white";
	}
	
	console.log(calPersonalEvents);
	
	//refreshes the personal calendar with new events
	
	cal.clear();
	
	cal.createSchedules(calPersonalEvents);
	
	cal.render(true);
	
	//get the requests waiting
	var data = {};
			
	data["function"] = "getRequests";
	data["data"] = {};
	data["data"]["email"] = getCookie("email");
	
	var jsonString = JSON.stringify(data);
			
	console.log(jsonString);
	
	//send the data to the socket
	webSocket.send(jsonString);

}

//get the initial data for the user
//note: need to make mini versions of these for each section so we can refresh the data when needed 
function getInitData(page){
	
	var email = getCookie("email");
	
	//ajax call to the servlet to get the data for the specified user
	var xhttp = new XMLHttpRequest();
	
	//on success, fill out the front end!
	xhttp.onload = function() {
		
		var initData = JSON.parse(this.responseText);
		console.log(initData);
		
		//fill out the content for the specfied page
		if(page == "Home"){
			initHomePageContent(initData);
		}
		else if(page == "Profile"){
			initProfilePageContent(initData);
		}
		else if (page == "Map"){
			getInitMapPageData(initData);
		}
		
	};
	
	//send the email to the servlet
	xhttp.open("POST", "PullInitialData", true);
	xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhttp.send("email=" + email.replace(/\s/g,''));
}

//get the init data for the map page returns data["friends"] data["events"]
function getInitMapPageData(initData){
	
	var data = {};
	
	data["friends"] = [];
	data["events"] = [];
	
	var friends = initData.friends;
	var events = initData.events;
	
	console.log(friends);
	console.log(events);
	
	//loop through the friends pulling their location
	for(i = 0; i < friends.length; i++){
		//get the lat and long
		var latitude = friends[i].latitude;
		var longitude = friends[i].longitude;
		//create the location pair
		var locPair = [];
		locPair[0] = friends[i].firstName + " " + friends[i].lastName;
		locPair[1] = latitude;
		locPair[2] = longitude;
		//add the pair to the list
		data["friends"][i] = locPair;
	}
	
	//loop through the events, pulling the location
	for(i = 0; i < events.length; i++){

		//store the address and the event name
		var locPair = [];
		locPair[0] = events[i].location;
		locPair[1] = events[i].name;

		//insert the address into the list
		data["events"][i] = locPair;
		
	}
	
	console.log(data);
	
	//return the data which contains both lists
	initMap(data);
	
}

//get the nearby friends, if there are nearby friends then pop open a modal with a list
function getNearbyFriends(email, latitude, longitude){
	//ajax call to the servlet to get the data for the specified user
	var xhttp = new XMLHttpRequest();
	
	//on success, fill out the front end!
	xhttp.onload = function() {
		
		console.log(this.responseText);
		
		var nearbyFriendsList = JSON.parse(this.responseText);
		
		//if there is a nearby friend
		if(nearbyFriendsList.length > 0){
			var htmlString = "";
			for(i = 0; i < nearbyFriendsList.length; i++){
				htmlString += "<li>" + nearbyFriendsList[i]["email"] + "</li>";
			}		
			document.getElementById("nearbyFriends").innerHTML = htmlString;
		} else {
			document.getElementById("nearbyFriends").innerHTML = "No nearby friends";
		}
		
	};
	
	//send the email to the servlet
	xhttp.open("POST", "GetNearbyFriends", true);
	xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhttp.send("email=" + email.replace(/\s/g,'') + "&latitude=" + latitude + "&longitude=" + longitude);
}

//build the profile page
function initProfilePageContent(initData){
	
	//array of all the friend objects
	var friends = initData.friends;
	
	//friends list html string
	friendsListHTML = '<center>';
	
	//loop through each friend, constructing the display list
	for(i = 0; i < friends.length; i++){
		//friend object
		var friend = friends[i];
		var fname = friend.firstName;
		var lname = friend.lastName;
		var profilePicURL = friend.profilePicURL;
		friendsListHTML += '<div class="friend"><div class="friendProfileImageContainer">';
		friendsListHTML += '<img class="friendProfileImage" src="' + profilePicURL + '">';
		friendsListHTML += '</div><div class="friendUsernameContainer">';
		friendsListHTML += fname + " " + lname;
		friendsListHTML += '</div></div>';
	}
	
	friendsListHTML += "</center>"
	
	//now that I have the friends list HTML, insert it into the container
	document.getElementById("friendsListContainer").innerHTML = friendsListHTML;
	
}

//updates the location in the database
function updateLocationDB(email, latitude, longitude){
	//ajax call to the servlet to get the data for the specified user
	var xhttp = new XMLHttpRequest();
	
	//on success, fill out the front end!
	xhttp.onload = function() {
		
		console.log(this.responseText);
		
	};
	
	//send the email to the servlet
	xhttp.open("POST", "UpdateLocation", true);
	xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhttp.send("email=" + email.replace(/\s/g,'') + "&latitude=" + latitude + "&longitude=" + longitude);
}

//gets cookie value from name
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function initMap(locationData){
	
	console.log("locationData:");
	console.log(locationData);
	
	var markers = [];
	
	//loop through the friends
	for(i = 0; i < locationData["friends"].length; i++){
		
		//create the object to be inserted into the array
		var markerObj = {};
		markerObj["coords"] = {};
		markerObj["coords"]["lat"] = locationData["friends"][i][1];
		markerObj["coords"]["lng"] = locationData["friends"][i][2];
		markerObj["content"] = "<h2>" + locationData["friends"][i][0] + "</h2>";
		
		markers.push(markerObj);
		
	}
	
	//loop through the events
	for(i = 0; i < locationData["events"].length; i++){
		
		//create the object to be inserted into the array
		var markerObj = {};
		markerObj["address"] = locationData["events"][i][0];
		markerObj["content"] = "<h2>" + locationData["events"][i][1] + "</h2>";
		
		markers.push(markerObj);
		
	}
	
	console.log("markers: ");
	console.log(markers);
	
	/* var markers=[
		{
			address:"1111 S Figueroa St Los Angeles", 
    		content:'<h1>Event 2</h1>'
		},
		{
			address:"3911 Figueroa St Los Angeles", 
    		content:'<h1>Event 1</h1>'
		},
		{
			coords:{lat:34.019785936349024,lng:-118.2814059658878},
    		content:'<h1>Friend 1</h1>'
		},
		{
			coords:{lat:34.02657246955646,lng:-118.28504407624125},
    		content:'<h1>Friend 2</h1>'
		}
	]; */
	
	var options = {
		zoom:13 ,
		center:{lat:34.0205,lng:-118.2856}
	}
	
	var map = new google.maps.Map(document.getElementById('map'), options);
	
	
	function getAddressMarker(props){
		var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': props.address }, function (results, status) {
        	if (status == google.maps.GeocoderStatus.OK) {
                /* return results[0].geometry.location; */
                var marker = new google.maps.Marker({
        			position:results[0].geometry.location,
        			map:map,
        		});
                marker.setIcon('https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png');
                if(props.content){
        			var infoWindow = new google.maps.InfoWindow({
        				content:props.content
        			});
        			
        			marker.addListener('click', function(){
        				infoWindow.open(map, marker);	
        			});
        		}
        	} else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
	}
	
	function addMarker(props){
		if(props.address){
			getAddressMarker(props);
		}else{
			var marker = new google.maps.Marker({
    			position:props.coords,
    			map:map,
    		});
			if(props.iconImage){
    			marker.setIcon(props.iconImage);
    		}
    		
    		if(props.content){
    			var infoWindow = new google.maps.InfoWindow({
    				content:props.content
    			});
    			
    			marker.addListener('click', function(){
    				infoWindow.open(map, marker);	
    			});
    		}
		}   		
	}
	
	for(var i = 0; i < markers.length; i++){
		addMarker(markers[i]);
	}
	
	updateLocation();
	
	function updateLocation(){
		
		console.log("update location");
		
		var infoWindow = new google.maps.InfoWindow({
			content:'<h1>Current Location</h1>'
		});
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
		    	(position) => {
		    		
					const pos = {
		    	            lat: position.coords.latitude,
		    	            lng: position.coords.longitude,
	    	        };
					
					//send the location to the DB
					console.log("updateLocationDB: " + getCookie("email") + " " + pos["lat"] + " " + pos["lng"]);
					updateLocationDB(getCookie("email"), pos["lat"], pos["lng"]);
					
					//notify if friends are closeby
					console.log("get nearby friends: " + getCookie("email") + " " + pos["lat"] + " " + pos["lng"]);
					getNearbyFriends(getCookie("email"), pos["lat"], pos["lng"]);
					
    		        var marker = new google.maps.Marker({
              			position:pos,
              			map:map,
              		});
		        	
		        	marker.addListener('click', function(){
		        		infoWindow.open(map, marker);	
        			});
		        },
		        () => {
		          handleLocationError(true, infoWindow, map.getCenter());
		        }
		      	);
		}else {
    		      // Browser doesn't support Geolocation
    		handleLocationError(false, infoWindow, map.getCenter());
		}
		looper();
	}

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		  infoWindow.setPosition(pos);
		  infoWindow.setContent(
		    browserHasGeolocation
		      ? "Error: The Geolocation service failed."
		      : "Error: Your browser doesn't support geolocation."
		  );
		  infoWindow.open(map);
	}
	
	function looper(){
		setTimeout(function(){
			updateLocation();
		}, 5000);
	}
}





