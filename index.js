/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// ./gradlew assembleRelease
AppRegistry.registerComponent(appName, () => App);
