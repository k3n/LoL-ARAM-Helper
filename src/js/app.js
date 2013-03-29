/*global define:false, window:false, document:false, */
/*jshint curly:true, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true, sub:true, undef:true, unused:false, node:true */
/**
 * k3n's ARAM helper.
 * 
 * I don't hold copyright to anything.
 *
 * https://github.com/k3n/LoL-ARAM-Helper
 */
define(['jquery', './lol/riot', './lol/sites'], function($, riot, sites){
    "use strict";

    function App(sel) {
        this.$el = $(sel);
        this.load();
    }
    
    App.prototype = {
        /**
         * Kicks off the app.
         * 
         * @return {App}
         */
        load: function load() {
            this.$el.append(this.champs());
            this.events();
            return this;
        },

        /**
         * Creates a row for each defined champion.
         * 
         * @return {DOMElement} unattached documentFragment
         */
        champs: function champs() {
            var that = this,
                $df = $(document.createDocumentFragment()),
                css = ['', ''],
                i = 0;

            $.each(riot.champs, function(abbr, champ){
                $df.append(
                    $('<div>', {'class': css[i++ & 1] + ' row'})
                        .append($('<span>', {'class': 'champ', text: champ.name}))
                        .append(that.siteButtons(abbr))
                        .data('champ', champ.name.toLowerCase())
                );
            });

            return $df;
        },

        /**
         * Wire up any event handlers.
         * 
         * @return {App}
         */
        events: function events(){
            var that = this;

            // Buttons
            this.$el.on('click', 'button', function(evt){
                window.open(this.value);
            });

            // Search            
            var $rows = this.$el.find('.row');
            this.$el.on('keyup', 'input[name="search"]', function(evt){
                var search = this.value.toLowerCase();

                // Empty value = show all
                if (!search.length) {
                    $rows.show();
                    return true;
                }

                $rows.trigger('search', search);
            });

            this.$el.on('click', 'input[name="search"]', function(evt){
                this.select();
            });                

            this.$el.on('search', '.row', function(evt, search){
                var $champ = $(this);
                $champ.toggle($champ.data('champ').indexOf(search) > -1);
            });

            return this;
        },

        /**
         * Build a set of links for a given champion.
         * 
         * @param  {object} a champion
         * @return {DOMElement} unattached documentFragment
         */
        siteButtons: function siteButtons(champ) {
            var $el = $(document.createDocumentFragment());
            $.each(sites, function(name, site){
                $el.append($('<button>', {
                    'class': 'btn',
                    text: site.abbr,
                    title: site.url,
                    type: 'button',
                    value: site.toUrl(champ)
                }));
            });
            return $el;
        }
    };

    return App;
});