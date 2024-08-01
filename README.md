# Browser extension for Makerflow

Saves you from yourself by blocking distracting websites when you need to focus on a task while in Flow Mode

## Installation

Install the extension from the [Chrome store](https://chrome.google.com/webstore/detail/makerflow/codmnedpgifnlanopnolihpobepaafic)



## Developer notes



### Important files

#### index.html

Content for the popover displayed when you click on the extentsion button. Let's you setup the API key, and domains of distracting websites.

#### overlay.html

Overlay displayed on distracting websites when user is in Flow Mode

#### assets/js/background.js

Background operations for the extension. Contains logic to poll backend and stop Flow Mode

#### assets/js/cn.js

Contains logic to show or hide the overlay.


### Running the extension

1. Zip all contents of this directory
2. In Chrome, go to [Manage Extensions](chrome://extensions/)
3. Make sure "Developer mode" is toggled *on*
4. Click on "Load unpacked"
5. Navigate to Zip file created in step 1
6. Open
