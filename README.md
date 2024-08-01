# Browser extension for Makerflow

Polls the Makerflow backend to see if the user is currently in Flow Mode. If they are, an overlay is shown over distracting web sites to keep the user focussed on their current task.

## Important files

### index.html

Content for the popover displayed when you click on the extentsion button. Let's you setup the API key, and domains of distracting websites.

### overlay.html

Overlay displayed on distracting websites when user is in Flow Mode

### assets/js/background.js

Background operations for the extension. Contains logic to poll backend and stop Flow Mode

### assets/js/cn.js

Contains logic to show or hide the overlay.


## Running the extension

1. Zip all contents of this directory
2. In Chrome, go to [Manage Extensions](chrome://extensions/)
3. Make sure "Developer mode" is toggled *on*
4. Click on "Load unpacked"
5. Navigate to Zip file created in step 1
6. Open
