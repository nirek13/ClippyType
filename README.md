Clipboard Typer
Overview
Clipboard Typer is a chrome extension that allows users to emulate typing text directly from their clipboard. It simplifies the process of pasting content by mimicking a natural typing effect, making it useful for various scenarios where manual typing is preferred.

Installation
Clone the repository or download the ZIP file.
Open Chrome and go to chrome://extensions/.
Enable "Developer mode" at the top-right corner.
Click on "Load unpacked" and select the extension directory.
Permissions
debugger: the extension uses the debugger api to emulate typing, as other methods do not work on some sites (i.e.: google docs)
scripting and activeTab: the extension uses scripting to inject a short script that reads the clipboard from the currently active tab, as there's no other way afaik of reading the clipboard from a service worker
Usage
Copy text to your clipboard.
Right click on any page and choose the "Start typing" option. Alternatively, click on the extension icon and choose the "Start typing" choice
To stop typing, repeat the same process, but choose "Stop typing"
