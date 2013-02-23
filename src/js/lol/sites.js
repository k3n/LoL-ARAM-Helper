/*global define:false */
define(['./riot'], function(riot) {

    function Site(url, abbr, toUrl) {
        this.url = url;
        this.abbr = abbr;
        this.toUrl = toUrl;
    }

    Site.prototype = {
        fixName: function fixName(c, r) {
            return c.replace(/\W/, (r || '')).toLowerCase();
        }
    };

    var sites = {
        LoLKing: new Site('LoLKing.net', 'LK', function toUrl(c) {
            return 'http://' + this.url + '/champions/' + this.fixName(c) + '#guides';
        }),

        SoloMid: new Site('SoloMid.net', 'SM', function toUrl(c) {
            return 'http://' + this.url + '/guides.php?champ=' + this.fixName(c);
        }),

        LeagueCraft: new Site('LeagueCraft.com', 'LC', function toUrl(c) {
            return 'http://' + this.url + '/strategies/guides/' + this.fixName(c, '-') + '-guides/?sort=Rating_DESC';
        }),

        LeagueOfLegends: new Site('LeagueOfLegends.com', 'LoL', function toUrl(c) {
            return 'http://na.' + this.url + '/champions/' + riot.champs[this.fixName(c)].url;
        })
    };

    return sites;
});