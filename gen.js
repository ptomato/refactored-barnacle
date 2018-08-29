/* exported generateSCSS, generateWebSCSS, generateYAML */

const {PALETTES} = imports.palette;

function _triple6bitToHex(r, g, b) {
    function format(val) {
        return (val << 2).toString(16).padStart(2, '0');
    }
    return `#${format(r)}${format(g)}${format(b)}`;
}

function generateSCSS(fontSize, cardBorders, colorScheme, disco) {
    let colorsSCSS;
    if (colorScheme === 'default') {
        colorsSCSS = `
$primary-light-color: #f4d94f;
$primary-medium-color: #5a8715;
`;
    } else {
        const palette = PALETTES[colorScheme];
        colorsSCSS = `
$primary-light-color: ${_triple6bitToHex(...palette[7])};
$primary-medium-color: ${_triple6bitToHex(...palette[1])};
$primary-dark-color: ${_triple6bitToHex(...palette[3])};

$accent-light-color: ${_triple6bitToHex(...palette[5])};
$accent-dark-color: ${_triple6bitToHex(...palette[6])};

$background-light-color: ${_triple6bitToHex(...palette[2])};
$background-dark-color: ${_triple6bitToHex(...palette[8])};
`;
    }

    // thanks to https://codepen.io/mike-schultz/pen/NgQvGO
    let discoSCSS = '';
    if (disco) {
        discoSCSS = `
.CardDefault {
    background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab,
        #5073b8, #1098ad, #07b39b, #6fba82);
    background-size: 300% 300%;
    animation: animatedgradient 3s ease alternate infinite;
}

@keyframes animatedgradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
`;
    }

    return `
${colorsSCSS}
$title-font: Skranji;
$logo-font: 'Patrick Hand SC';

@import 'thematic';

.BannerDynamic__logo {
    font-weight: 400;
    color: $primary-light-color;
}

.home-page .Card__title {
    font-weight: bold;
    font-size: ${fontSize * 0.156}em;
}

.set-page .Card__title {
    font-weight: bold;
    font-size: ${fontSize * 0.338}em;
}

.LayoutSidebar .sidebar .ContentGroupNoResultsMessage {
    &__title {
        font-size: ${fontSize * 3}px;
    }

    &__subtitle {
        font-size: ${fontSize * 2}px;
    }
}

.CardDefault {
    &__title {
        font-size: ${fontSize * 1.8}px;
    }

    &__synopsis {
        font-size: ${fontSize * 1.6}px;
    }

    &__context {
        font-size: ${fontSize * 1.4}px;
    }

    &.CardText {
        &.width-h,
        &.width-g,
        &.width-f,
        &.width-e.height-e {
            .CardDefault__title {
                font-size: ${fontSize * 4.8}px;
            }
            .CardDefault__synopsis {
                font-size: ${fontSize * 2}px;
            }
        }

        &.width-e.height-d,
        &.width-e.height-c {
            .CardDefault__title {
                font-size: ${fontSize * 3.68}px;
            }
        }

        &.width-e,
        &.width-d {
            .CardDefault__title {
                font-size: ${fontSize * 2.72}px;
            }
        }

        &.width-c {
            .CardDefault__title {
                font-size: ${fontSize * 2.304}px;
            }
        }

        &.width-b {
            .CardDefault__title {
                font-size: ${fontSize * 1.8}px;
            }
        }

        &.height-a {
            .CardDefault__title {
                font-size: ${fontSize * 1.6}px;
            }
        }
    }

    &.CardPolaroid {
        &.width-h,
        &.width-g,
        &.width-f,
        &.width-e.height-e {
            .CardDefault__title {
                font-size: ${fontSize * 3.68}px;
            }
        }

        &.width-h.height-b,
        &.width-g.height-b,
        &.width-f.height-b,
        &.width-e,
        &.width-d.height-e,
        &.width-d.height-d {
            .CardDefault__title {
                font-size: ${fontSize * 2.4}px;
            }
        }

        &.width-d,
        &.width-c,
        &.width-b.height-e,
        &.width-b.height-d {
            .CardDefault__title {
                font-size: ${fontSize * 2}px;
            }
        }

        &.width-b,
        &.height-a {
            .CardDefault__title {
                font-size: ${fontSize * 1.6}px;
            }
        }
    }

    &.CardPost {
        .CardDefault__context {
            font-size: ${fontSize * 1.4}px;
        }

        &.width-h,
        &.width-g {
            .CardDefault__title {
                font-size: ${fontSize * 4.8}px;
            }
        }

        &.width-h.height-c,
        &.width-g.height-c,
        &.width-f,
        &.width-e.height-e {
            .CardDefault__title {
                font-size: ${fontSize * 3.68}px;
            }
        }

        &.width-g.height-b,
        &.width-h.height-b,
        &.width-f.height-b,
        &.width-e,
        &.width-d.height-e,
        &.width-d.height-d {
            .CardDefault__title {
                font-size: ${fontSize * 2.4}px;
            }
        }

        &.width-d,
        &.width-c,
        &.width-b.height-e,
        &.width-b.height-d {
            .CardDefault__title {
                font-size: ${fontSize * 2}px;
            }
        }

        &.width-b,
        &.height-a {
            .CardDefault__title {
                font-size: ${fontSize * 1.6}px;
            }
        }
    }
}

.LayoutSidebar {
    .content .BannerSearch__title {
        font-size: ${fontSize * 7.2}px;
    }

    .sidebar .CardTitle {
        &__title {
            font-size: ${fontSize * 2}px;
        }
    }
}

.BannerSet .CardTitle {
    &__title {
        font-size: ${fontSize * 5.4}px;
    }
}

.BannerDynamic {
    font-size: ${fontSize * 2}px;
}

// Card borders

.CardDefault {
    padding: ${cardBorders}px;
    background-color: $primary-light-color;
}

${discoSCSS}
`;
}

function generateWebSCSS(fontSize) {
    return `
html, body {
    font-size: ${fontSize * 2.2}px;
}
`;
}

function generateYAML(arrangement, decodefunc, noise) {
    let moduleName;
    switch (arrangement) {
    case 'piano':
        moduleName = 'Piano';
        break;
    case 'windshield':
        moduleName = 'Windshield';
        break;
    case 'tiled-grid':
    default:
        moduleName = 'TiledGrid';
        break;
    }

    let decodefuncParam = '';
    if (decodefunc) {
        decodefuncParam = `      decodefunc: |
        ${decodefunc}\n`;
    }

    return `---
overrides:
  home-sets-arrangement:
    type: Arrangement.${moduleName}Noise
    properties:
      noise: ${noise}
  home-sets-card:
    type: Card.Rot13
    properties:
      rotation: 13
      excluded_types:
        - 0
        - 1
${decodefuncParam}
  app-banner:
    type: Banner.Rot13
    properties:
      mode: full
      layout: horizontal
      valign: center
      halign: center
      rotation: 13
${decodefuncParam}\
---
!import 'thematic'
`;
}
