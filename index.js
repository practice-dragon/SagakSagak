/**
 * @format
 */

import {AppRegistry} from "react-native";
import App from "./src/navigation/AppNavigator";
import {name as appName} from "./app.json";
import StorybookUIRoot from "@story/index";
AppRegistry.registerComponent(appName, () => App);
// AppRegistry.registerComponent(appName, () => StorybookUIRoot);
