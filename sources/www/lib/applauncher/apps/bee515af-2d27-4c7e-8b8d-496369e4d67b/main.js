include('util.js');

var tconte = [
'-',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Conseil_tenu_par_les_Rats.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Aigle_la_Laie_et_la_Chatte.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_alouette_et_ses_petits_avec_le_maitre_d_un_champ.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Amour_et_la_Folie.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Ane_charge_d_eponges_et_l_Ane_charge_de_sel.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Ane_et_le_petit_Chien.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Ane_portant_des_reliques.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Ane_vetu_de_la_peau_du_Lion.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Astrologue_qui_se_laisse_tomber_dans_un_puits.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Avare_qui_a_perdu_son_tresor.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_enfant_et_le_maitre_d_ecole.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Hirondelle_et_les_petits_Oiseaux.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_homme_entre_deux_ages_et_ses_deux_maitresses.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Homme_et_la_Puce.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_huitre_et_les_plaideurs.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_ivrogne_et_sa_femme.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_oeil_du_maitre.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_Oiseau_blesse_d_une_fleche.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_L_ours_et_les_deux_compagnons.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_Belette_entree_dans_un_grenier.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_Besace.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_chatte_metamorphosee.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_Chauve-souris_et_les_deux_Belettes.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_cigale_et_la_fourmi.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_colombe_et_la_fourmi.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_femme_noyee.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_fille.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_fortune_et_le_jeune_enfant.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_Grenouille_et_le_Rat.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_grenouille_qui_se_veut_faire_aussi_grosse_que_le_boeuf.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_jeune_veuve.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_laitiere_et_le_pot_au_lait.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_Lice_et_sa_Compagne.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_ligue_des_rats.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_montagne_qui_accouche.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_mort_et_le_bucheron.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_mort_et_le_mourant.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_tortue_et_les_deux_canards.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_La_vieille_et_les_deux_servantes.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Bucheron_et_Mercure.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Cerf_et_la_Vigne.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Chameau_et_les_Batons_flottants.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_charretier_embourbe.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Chat_et_le_Renard.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_chat_et_un_vieux_rat.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_chat_la_belette_et_le_petit_lapin.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_chene_et_le_roseau.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Cheval_et_le_Loup.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Cheval_s_etant_voulu_venger_du_Cerf.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Chien_qui_lache_sa_proie_pour_l_ombre.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_coche_et_la_mouche.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_cochet_le_chat_et_le_souriceau.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Coq_et_La_Perle.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_corbeau_et_le_renard.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Corbeau_voulant_imiter_l_Aigle.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_cygne_et_le_cuisinier.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Geai_pare_des_plumes_du_Paon.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_gland_et_la_citrouille.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_heron.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_jardinier_et_son_seigneur.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_laboureur_et_ses_enfants.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Lievre_et_la_Perdrix.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_lievre_et_la_tortue.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Lion_abattu_par_l_Homme.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Lion_et_l_Ane_chassant.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_lion_et_le_moucheron.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_lion_et_le_rat.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_loup_devenu_berger.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_loup_et_l_agneau.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_loup_et_la_cigogne.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_loup_et_le_chien.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_loup_et_le_chien_maigre.mp3',
'http://www.litteratureaudio.org/La_Fontaine_-_Le_loup_et_les_bergers.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Loup_plaidant_contre_le_Renard_par-devant_le_Singe.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Loup_la_Chevre_et_le_Chevreau.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Loup_la_Mere_et_l_Enfant.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_meunier_son_fils_et_l_ane.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Paon_se_plaignant_a_Junon.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Patre_et_le_Lion.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_petit_poisson_et_le_pecheur.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_pot_de_terre_et_le_pot_de_fer.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_rat_de_ville_et_le_rat_des_champs.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_rat_et_l_huitre.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Renard_ayant_la_queue_coupee.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_renard_et_la_cigogne.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Renard_et_le_Bouc.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Renard_et_le_Buste.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_renard_et_les_raisins.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_savetier_et_le_financier.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Serpent_et_la_Lime.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_singe_et_le_dauphin.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Singe_et_le_Leopard.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_songe_d_un_habitant_du_Mogol.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_vieillard_et_les_trois_jeunes_hommes.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Le_Villageois_et_le_Serpent.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_animaux_malades_de_la_peste.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_deux_amis.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_deux_coqs.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_deux_mulets.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_deux_pigeons.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_deux_Rats_le_Renard_et_l_oeuf.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_femmes_et_le_secret.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_Grenouilles_qui_demandent_un_Roi.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_loups_et_les_brebis.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_medecins.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_Oreilles_du_Lievre.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_poissons_et_le_cormoran.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Les_Voleurs_et_l_Ane.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Parole_de_Socrate.mp3',
'http://www.litteratureaudio.net/Jean_de_La_Fontaine_-_Phoebus_et_Boree.mp3'
	];
	
var indMax = 110;
var indice = parseInt(params[instanceName].conte);
if (indice==0) indice = Math.floor((Math.random()*(indMax-1)))+1; // 1..110
var fquit = parseInt(params[instanceName].fquit);

var url = tconte[indice];
var bpause = false;

var buttonListener = function(event) {
	if (event == 'LONG_START') {
		karotz.led.fade('FF0000', 3000);
		karotz.multimedia.play(url, evtMM); bpause = false;
		return true;
	}
	if (event == 'SIMPLE') {
		if (!bpause) {
			bpause = true; karotz.led.pulse('0000FF', 3500, -1);
        	karotz.multimedia.pause();
		}	else {
			karotz.led.fade('FF0000', 3000);
        	karotz.multimedia.resume(); bpause = false;
		}
	}
    if (event == 'DOUBLE') {
		karotz.multimedia.stop(); pause(500); exit();
	}
	return true;
}

var earsListener = function(event, step, length) {
	if (event.indexOf('START') >= 0) {
		if (event == 'START_RIGHT') indice = Math.floor((Math.random()*(indMax-1)))+1;
			else if (++indice > indMax) indice = 1;
		url = tconte[indice];
		karotz.led.fade('FF0000', 3000);
		karotz.multimedia.play(url, evtMM); bpause = false;
	}
	return true;
}

var evtMM = function(event) {
    if (((event == 'CANCELLED') || (event == 'TERMINATED')) && !bpause) {
		if (!fquit) {
			if (++indice > indMax) indice = 1;
			url = tconte[indice]; karotz.multimedia.play(url, evtMM);
		} else { karotz.multimedia.stop(); pause(3000); exit(); }
	}
	return true;
}

var onKarotzConnect = function(data) {
	karotz.button.addListener(buttonListener);
	karotz.ears.addListener(earsListener);

	setTimeout(300000, function(){ log('ping'); ping(); return true; });

	karotz.led.fade('FF0000', 3000);
	karotz.multimedia.play(url, evtMM);
}

var karotz_ip = 'localhost';
var data = {};

karotz.connectAndStart(karotz_ip, 9123, onKarotzConnect, data);