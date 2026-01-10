module.exports = {
    extends: ["stylelint-config-standard"],
    rules: {
        "color-hex-length": null,
        "color-function-alias-notation": null,
        "color-function-notation": null,
        "alpha-value-notation": null,
        "media-feature-range-notation": null,
        "property-no-vendor-prefix": null,
        "font-family-name-quotes": null,
        "keyframes-name-pattern": null,
        "value-keyword-case": null,
        "comment-empty-line-before": null,
        "no-duplicate-selectors": true,
        "at-rule-no-unknown": [
            true,
            {
                "ignoreAtRules": ["tailwind", "apply", "variants", "responsive", "screen", "keyframes"]
            }
        ]
    }
};
