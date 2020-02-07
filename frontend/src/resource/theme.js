"use strict"

import { createMuiTheme } from '@material-ui/core/styles'

/**
 * Describes how the application should look.
 *
 * Used as the property value when declaring a ThemeProvider.
 */
export default createMuiTheme({
    palette: {
        "common": {
            "black": "#000",
            "white": "#fff"
        },
        "type": "light",
        "primary": {
            "light": "#7986cb",
            "main": "#3f51b5",
            "dark": "#303f9f",
            "contrastText": "#fff"
        },
        "secondary": {
            "light": "#ff4081",
            "main": "#f50057",
            "dark": "#c51162",
            "contrastText": "#fff"
        },
        "error": {
            "light": "#e57373",
            "main": "#f44336",
            "dark": "#d32f2f",
            "contrastText": "#fff"
        },
        "warning": {
            "light": "#ffb74d",
            "main": "#ff9800",
            "dark": "#f57c00",
            "contrastText": "rgba(0, 0, 0, 0.87)"
        },
        "info": {
            "light": "#64b5f6",
            "main": "#2196f3",
            "dark": "#1976d2",
            "contrastText": "#fff"
        },
        "success": {
            "light": "#81c784",
            "main": "#4caf50",
            "dark": "#388e3c",
            "contrastText": "rgba(0, 0, 0, 0.87)"
        },
        "grey": {
            "50": "#fafafa",
            "100": "#f5f5f5",
            "200": "#eeeeee",
            "300": "#e0e0e0",
            "400": "#bdbdbd",
            "500": "#9e9e9e",
            "600": "#757575",
            "700": "#616161",
            "800": "#424242",
            "900": "#212121",
            "A100": "#d5d5d5",
            "A200": "#aaaaaa",
            "A400": "#303030",
            "A700": "#616161"
        },
        "contrastThreshold": 3,
        "tonalOffset": 0.2,
        "text": {
            "primary": "rgba(0, 0, 0, 0.87)",
            "secondary": "rgba(0, 0, 0, 0.54)",
            "disabled": "rgba(0, 0, 0, 0.38)",
            "hint": "rgba(0, 0, 0, 0.38)"
        },
        "divider": "rgba(0, 0, 0, 0.12)",
        "background": {
            "paper": "#fff",
            "default": "#fafafa"
        },
        "action": {
            "active": "rgba(0, 0, 0, 0.54)",
            "hover": "rgba(0, 0, 0, 0.04)",
            "hoverOpacity": 0.04,
            "selected": "rgba(0, 0, 0, 0.08)",
            "selectedOpacity": 0.08,
            "disabled": "rgba(0, 0, 0, 0.26)",
            "disabledBackground": "rgba(0, 0, 0, 0.12)"
        }
    }
})