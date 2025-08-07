document.addEventListener("DOMContentLoaded", function() {
    // WebSocket Connection
    const wsUri = "ws://xxx"; // Change to your WebSocket server address
    let websocket = new WebSocket(wsUri);

    websocket.onopen = function(evt) {
        console.log("Connected to WebSocket server");
    };

    websocket.onerror = function(evt) {
        console.error("WebSocket connection error:", evt.data);
    };

    // Function to send commands to WebSocket server
    function sendCommand(command) {
        if (websocket.readyState === websocket.OPEN) {
            let data = { command: command };
            websocket.send(JSON.stringify(data));
        }
    }

    // Event listeners for control buttons
    document.getElementById('forward').addEventListener('click', function() { sendCommand('forward'); });
    document.getElementById('backward').addEventListener('click', function() { sendCommand('backward'); });
    document.getElementById('left').addEventListener('click', function() { sendCommand('left'); });
    document.getElementById('right').addEventListener('click', function() { sendCommand('right'); });
    document.getElementById('stop').addEventListener('click', function() { sendCommand('stop'); });

    // ROS Connection
    var ros = new ROSLIB.Ros({
        url: 'ws://xxx' // Change to your ROS WebSocket server
    });

    var viewer = new ROS2D.Viewer({
        divID: 'map',
        width: 850,
        height: 500,
    });

    var gridClient = new ROS2D.OccupancyGridClient({
        ros: ros,
        rootObject: viewer.scene,
        continuous: true
    });

    
  var robotModel = new ROS2D.NavigationArrow({
    size: 5,
    strokeSize: 0.01,
    fillColor: createjs.Graphics.getRGB(255, 128, 0, 0.66),
    pulse: true
  });
  robotModel.visible = false;
  viewer.scene.addChild(robotModel);
  
  // ... [istniejący kod] ...

 // Create containers for the axes
  var xAxisArrow = new createjs.Shape();
  var yAxisArrow = new createjs.Shape();

// Draw X-axis arrow
  drawArrow(xAxisArrow, 0, 0, 1, 0, "blue", 0.05);
  viewer.scene.addChild(xAxisArrow);

// Draw Y-axis arrow
  drawArrow(yAxisArrow, 0, 0, 0, -1, "blue", 0.05);
  viewer.scene.addChild(yAxisArrow);

  function drawArrow(arrowContainer, startX, startY, endX, endY, color, thickness) {
    // Line
    arrowContainer.graphics.setStrokeStyle(thickness).beginStroke(color);
    arrowContainer.graphics.moveTo(startX, startY);
    arrowContainer.graphics.lineTo(endX, endY);

    // Arrowhead
    var angle = Math.atan2(endY - startY, endX - startX);
    var headLength = 0.42;  // Length of the arrow head
    arrowContainer.graphics.lineTo(endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6));
    arrowContainer.graphics.moveTo(endX, endY);
    arrowContainer.graphics.lineTo(endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6));
  }
  function createAxisLabel(text, x, y, color, fontSize) {
    var label = new createjs.Text(text, fontSize + " Arial", color);
    label.x = x;
    label.y = y;
    label.textAlign = "center";
    label.textBaseline = "middle";
    return label;
  }
  
  var xAxisLabel = createAxisLabel("X", 1.2, 0, "blue", "0.4px"); // Position it slightly beyond the end of the X-axis
  var yAxisLabel = createAxisLabel("Y", 0, -1.2, "blue", "0.4px"); // Position it slightly above the end of the Y-axis

// Add labels to the scene
  viewer.scene.addChild(xAxisLabel);
  viewer.scene.addChild(yAxisLabel);
  var orientationArrow = new createjs.Shape();
  orientationArrow.visible = false;
  viewer.scene.addChild(orientationArrow);
  
  var orientationArrowY = new createjs.Shape();
  orientationArrowY.visible = false;
  viewer.scene.addChild(orientationArrowY);
  
  var robotDot = new createjs.Shape();
robotDot.graphics.beginFill("blue").drawCircle(0, 0, 0.17); // Green dot with a radius of 3
robotDot.visible = false;
viewer.scene.addChild(robotDot);

  var poseListener = new ROSLIB.Topic({
    ros: ros,
    name: '/slam_out_pose',
    messageType: 'geometry_msgs/PoseStamped',
    throttle_rate: 50
  });
  
  poseListener.subscribe(function(message) {
    var pose = message.pose;
    robotModel.x = pose.position.x;
    robotModel.y = -pose.position.y;
    var angleRadians = -QuaternionToEuler(pose.orientation).yaw;
    robotModel.rotation = -QuaternionToEuler(pose.orientation).yaw * 180 / Math.PI;
    robotModel.visible = false;

    // Log position and orientation in 3D (x, y, z and roll, pitch, yaw)
    var orientationEuler = QuaternionToEuler(pose.orientation);
    console.log("Position -> x: " + pose.position.x + ", y: " + pose.position.y + ", z: " + pose.position.z);
    console.log("Orientation -> roll: " + orientationEuler.roll + ", pitch: " + orientationEuler.pitch + ", yaw: " + orientationEuler.yaw);
   
    updateRegionOfInterest(pose.position.x, -pose.position.y);

    updateOrientationArrow(robotModel.x, robotModel.y, angleRadians);
    updateOrientationArrowY(robotModel.x, robotModel.y, angleRadians); 
    updateRobotDot(robotModel.x, robotModel.y);

    updateRegionOfInterest(robotModel.x, robotModel.y);
      var positionElement = document.getElementById('position');
  var orientationElement = document.getElementById('orientation');

  // Update the elements with the robot pose data
  var pose = message.pose;
  positionElement.textContent = "Position: X: " + pose.position.x.toFixed(2) +
                                ", Y: " + pose.position.y.toFixed(2) +
                                ", Z: " + pose.position.z.toFixed(2);
  
  var orientationEuler = QuaternionToEuler(pose.orientation);
  orientationElement.textContent = "Orientation: Roll: " + orientationEuler.roll.toFixed(2) +
                                   ", Pitch: " + orientationEuler.pitch.toFixed(2) +
                                   ", Yaw: " + orientationEuler.yaw.toFixed(2);
  });
  
   function updateOrientationArrow(x, y, angle) {

    var lineLength = 1.7; // Length of the orientation line
    var angleDegrees = angle * 180 / Math.PI; // Convert angle to degrees

    orientationArrow.graphics.clear()
      .setStrokeStyle(0.15) // Set the line thickness
      .beginStroke("red") // Begin a red line
      .moveTo(0, 0) // Start at the current location
      .lineTo(lineLength, 0) // Draw a line of the specified length
      .endStroke(); // End the line

    orientationArrow.x = x;
    orientationArrow.y = y;
    orientationArrow.rotation = angleDegrees;
    orientationArrow.visible = true;
  }
  
  function updateRobotDot(x, y) {
    robotDot.x = x;
    robotDot.y = y;
    robotDot.visible = true;
  }
  
  function updateOrientationArrowY(x, y, angle) {
    // Modify the properties to represent Y-axis orientation
    var lineLength = 1.7; // Length of the orientation line for Y
    var angleDegrees = angle * 180 / Math.PI+90; // Convert angle to degrees

    orientationArrowY.graphics.clear()
      .setStrokeStyle(0.15) // Set the line thickness
      .beginStroke("green") // Begin a blue line for Y-axis
      .moveTo(0, 0) // Start at the current location
      .lineTo(lineLength, 0) // Draw a line of the specified length
      .endStroke(); // End the line

    orientationArrowY.x = x;
    orientationArrowY.y = y;
    orientationArrowY.rotation = angleDegrees;
    orientationArrowY.visible = true;
  }


  function updateRegionOfInterest(x, y) {
    var roiWidth = 40; // Adjust based on your requirements
    var roiHeight = 25; // Adjust based on your requirements

    viewer.scaleToDimensions(roiWidth, roiHeight);
    viewer.shift(x - roiWidth / 2, y - roiHeight / 2);
  }

  function QuaternionToEuler(q) {
    var ysqr = q.y * q.y;
    var t0 = +2.0 * (q.w * q.x + q.y * q.z);
    var t1 = +1.0 - 2.0 * (q.x * q.x + ysqr);
    var roll = Math.atan2(t0, t1);

    var t2 = +2.0 * (q.w * q.y - q.z * q.x);
    t2 = t2 > 1.0 ? 1.0 : (t2 < -1.0 ? -1.0 : t2);
    var pitch = Math.asin(t2);

    var t3 = +2.0 * (q.w * q.z + q.x * q.y);
    var t4 = +1.0 - 2.0 * (ysqr + q.z * q.z);
    var yaw = Math.atan2(t3, t4);

    return { roll: roll, pitch: pitch, yaw: yaw };
  }
});

