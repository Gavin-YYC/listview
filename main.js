import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "*": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "html": {
        "height": "100%"
    },
    "body": {
        "height": "100%",
        "overflow": "scroll"
    },
    "wrapper": {
        "position": "relative"
    },
    "wrappertransition": {
        "transition": "all 0.2s ease-in"
    },
    "wrapper pulling-tip": {
        "position": "absolute",
        "overflow": "hidden",
        "width": "100%",
        "top": -999999,
        "left": 0
    },
    "wrapper item-list": {
        "display": "block",
        "width": "100%",
        "overflow": "auto"
    },
    "wrapper item-list > li": {
        "width": "100%",
        "height": 40,
        "lineHeight": 40,
        "backgroundColor": "#f1f1f1",
        "paddingTop": 0,
        "paddingRight": 20,
        "paddingBottom": 0,
        "paddingLeft": 20,
        "borderBottom": "1px solid #ddd"
    },
    "wrapper item-list > li:last-child": {
        "border": "none"
    }
});