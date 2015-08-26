try { ace.settings.check('sidebar', 'fixed') } catch (e) { console.log(e); }

// Fix 7/9/2015, Onur: The arrow icon was not correct when it remembers the last status and comes collapsed
try { ace.settings.check('sidebar', 'collapsed'); if (ace.settings.is('sidebar', 'collapsed')) { $("#sidebar-collapse i").addClass("fa-angle-double-right").removeClass("fa-angle-double-left"); } } catch (e) { console.log(e); }

try { ace.settings.check('navbar', 'fixed') } catch (e) { console.log(e); }

$(document).on('settings.ace', function (event, name, status) {
    //name is one of the following
    //navbar_fixed
    //sidebar_fixed
    //breadcrumbs_fixed
    //main_container_fixed
    //sidebar_collapsed

    //status is either true or false

    if (name == 'sidebar_collapsed') {
        //sidebar was collapsed by user, do something
    }

    if (name == 'sidebar_fixed' && status == false) {
        //sidebar was unfixed by user, do something
    }
});