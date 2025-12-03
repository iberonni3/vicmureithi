# Installing GSAP Club Plugins (SplitText)

Since you're now a Club GreenSock member, you have two options:

## Option 1: NPM Registry (Recommended)

1. Get your authentication token from: https://greensock.com/account
2. Create a `.npmrc` file in your project root with:
   ```
   @gsap:registry=https://npm.greensock.com
   //npm.greensock.com/:_authToken=YOUR_TOKEN_HERE
   ```
3. Install the plugin:
   ```bash
   npm install gsap@npm:@gsap/shockingly
   ```

## Option 2: Manual Installation (Faster)

1. Go to: https://greensock.com/account/downloads
2. Download the "Club Plugins" zip file
3. Extract `SplitText.min.js` from the zip
4. Create folder: `src/utils/gsap/`
5. Copy `SplitText.min.js` to `src/utils/gsap/SplitText.min.js`
6. Update the import in Hero.jsx to:
   ```javascript
   import { SplitText } from '../../utils/gsap/SplitText.min.js';
   ```

**Choose whichever option is easier for you!**

Let me know which option you'd like to use and I'll help complete the setup.
