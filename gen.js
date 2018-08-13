/* exported generateSCSS, generateWebSCSS, generateYAML */

function generateSCSS(fontSize, cardBorders) {
    return `
$primary-light-color: #f4d94f;
$primary-medium-color: #5a8715;

$title-font: Skranji;
$logo-font: 'Patrick Hand SC';

@import 'thematic';

.BannerDynamic__logo {
    font-weight: 400;
    color: white;
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
    border: ${cardBorders}px solid $primary-light-color;
}
`;
}

function generateWebSCSS(fontSize) {
    return `
html, body {
    font-size: ${fontSize * 2.2}px;
}
`;
}

function generateYAML(arrangement) {
    void arrangement;  // not implemented yet
    return "!import 'thematic'";
}
