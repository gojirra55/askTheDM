'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).
var spells = require('./spells');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'SpellsIntent': function () {
        var spellSlot = this.event.request.intent.slots.Spell;
        var spellName;
        if (spellSlot && spellSlot.value) {
            spellName = spellSlot.value.toLowerCase();
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), spellName);
        var spells = this.t("SPELLS");
        var spell = spells[spellName];

        if (spell) {
            this.attributes['speechOutput'] = spell;
            this.attributes['repromptSpeech'] = this.t("SPELL_REPEAT_MESSAGE");
            this.emit(':tellWithCard', spell, this.attributes['repromptSpeech'], cardTitle, spell);
        } else {
            var speechOutput = this.t("SPELL_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("SPELL_NOT_FOUND_REPROMPT");
            if (spellName) {
                speechOutput += this.t("SPELL_NOT_FOUND_WITH_SPELL_NAME", spellName);
            } else {
                speechOutput += this.t("SPELL_NOT_FOUND_WITHOUT_SPELL_NAME");
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var languageStrings = {
    "en": {
        "translation": {
            "SPELLS": spells.SPELLS_EN_US,
            "SKILL_NAME": "Ask the DM",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what\'s fireball? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  - Info for %s.",
            "HELP_MESSAGE": "You can ask questions such as, what\'s Cure Wounds, or, you can say exit...Now, what can I help you with?",
            "HELP_REPROMPT": "You can say things like, what\'s Death Ward, or you can say exit...Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "SPELL_REPEAT_MESSAGE": "Try saying repeat.",
            "SPELL_NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know ",
            "SPELL_NOT_FOUND_WITH_SPELL_NAME": "the spell info for %s. ",
            "SPELL_NOT_FOUND_WITHOUT_SPELL_NAME": "that spell. ",
            "SPELL_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    },
    "en-US": {
        "translation": {
            "SPELLS" : spells.SPELLS_EN_US,
            "SKILL_NAME" : "Ask the DM"
        }
    },
    "en-GB": {
        "translation": {
            "SPELLS": spells.SPELL_EN_GB,
            "SKILL_NAME": "British Ask the DM"
        }
    }
};