**DOMINION � Dokument�ci� | dominion.webasztal.hu**

**GITHUB LINKEK:  
WEB:** <https://github.com/k0mj4ti/dominion>**  
ASZTALI:**

**1\. Mit csin�l az alkalmaz�s?**

A projekt egy **k�rty�s t�l�l� strat�giai j�t�k**, amelyben a j�t�kos k�l�nb�z� esem�nyekkel tal�lkozik, �s d�nt�sei befoly�solj�k a statisztik�it. Ha b�rmelyik statisztika (�let, �tel, ital, ment�lis �llapot) null�ra cs�kken, a j�t�kos meghal.

- A **WPF alkalmaz�s** a j�t�kfel�let.
- A **weboldal admin fel�letk�nt m�k�dik**, ahol �j k�rty�kat lehet l�trehozni, szerkeszteni �s t�r�lni.
- A **backend kezeli a j�t�kadatokat �s a felhaszn�l�i hiteles�t�st**.

**2\. Platformok �s funkci�ik**

**Backend (API - Next.js)**

- Felhaszn�l�kezel�s (regisztr�ci�, bejelentkez�s, hiteles�t�s)
- J�t�kadatok ment�se �s bet�lt�se
- K�rty�k l�trehoz�sa, szerkeszt�se, t�rl�se
- _Statisztik�k t�rol�sa (j�t�kos el�rehalad�s, t�l�l�si napok)_

**_WPF kliens (J�t�k)_**

- _Felhaszn�l�i bejelentkez�s_
- _J�t�kmechanika (k�rtyah�z�s, d�nt�sek, statok kezel�se)_
- _J�t�k�ll�s ment�se_

**_Webes admin fel�let_**

- _Bejelentkez�s az admin panelre_
- _K�rty�k l�trehoz�sa, szerkeszt�se, t�rl�se_
- _J�t�kos statisztik�k megtekint�se_

**_3\. Felhaszn�l�i fel�let_**

_A j�t�k egy egyszer�_ **_k�rtya alap�_** _kezel�fel�letet haszn�l:_

- _A k�perny� tetej�n a_ **_j�t�kos statjai_** _jelennek meg (�let, �tel, Ital, Ment�lis �llapot)._
- _K�z�pen egy_ **_k�rtya_** _l�that�_ **_c�mmel, k�ppel �s le�r�ssal_**_._
- _A j�t�kos_ **_k�t d�nt�si lehet�s�g_** _k�z�l v�laszthat._
- _A d�nt�s ut�n a statisztik�k_ **_friss�lnek_**_._
- _Ha valamelyik statisztika_ **_0-ra cs�kken_**_, a j�t�k v�get �r._

**_4\. Adatb�zis fel�p�t�se_**

**_Felhaszn�l�k t�bl�zata_**

| **_id_** | **_email_** | **_username_** | **_password_** | **_currentstats_** | **_dayssurvived_** | **_cardindex_** |
| --- | --- | --- | --- | --- | --- | --- |
| _1_ | _user@gmail.com_ | _Player1_ | _hashed_pw_ | _{life: 50, food: 30, water: 20, mental: 40}_ | _5_ | _12_ |

**_K�rty�k t�bl�zata_**

| **_id_** | **_title_** | **_imagePath_** | **_description_** | **_choices_** |
| --- | --- | --- | --- | --- |
| _1_ | _"Bokor bogy�kkal"_ | _/images/berry_bush.jpg_ | _"Egy bokorhoz �rsz tele bogy�kkal."_ | _{"Eat": {life: -5, food: +10}, "Ignore": {food: -5}}_ |

**_5\. API v�gpontok_**

**_Felhaszn�l�i hiteles�t�s_**

- **_POST_** _/api/auth/login - Bejelentkez�s (email, jelsz� � token visszaad�sa)_
- **_GET_** _/api/auth/me - Felhaszn�l�i adatok lek�r�se hiteles�t�s ut�n_
- **_POST_** _/api/auth/register - Regisztr�ci� (email, felhaszn�l�n�v, jelsz�)_

**_K�rtyakezel�s_**

- **_GET_** _/api/cards - Az �sszes k�rtya lek�r�se_
- **_POST_** _/api/cards - �j k�rtya l�trehoz�sa (title, imagePath, description, choices)_
- **_GET_** _/api/cards/\[id\] - Egy adott k�rtya lek�r�se az ID alapj�n_
- **_PUT_** _/api/cards/\[id\] - Egy adott k�rtya szerkeszt�se_
- **_DELETE_** _/api/cards/\[id\] - Egy adott k�rtya t�rl�se_

**_Felhaszn�l�i adatok kezel�se_**

- **_GET_** _/api/user/\[email\] - Felhaszn�l�i adatok lek�r�se email alapj�n_
- **_PATCH_** _/api/user/save - Felhaszn�l�i statisztik�k ment�se (currentstats, dayssurvived, cardindex)_

**_6\. Weboldal URL-ek_**

- **_Base URL_**_:_ [_https://dominion.webasztal.hu_](https://dominion.webasztal.hu)
- **_Admin panel_**_: /_
- **_Bejelentkez�s_**_: /auth/login_
- **_Regisztr�ci�_**_: /auth/register_