/**
 * Countries and Cities Data
 * Shared country/city lists for registration forms
 * Complete list of countries and cities for registration forms
 */

// Global South Countries (Local Community)
export const globalSouthCountries = [
  // Africa
  { code: 'NG', name: 'Nigeria', cities: ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Kaduna', 'Enugu', 'Aba', 'Warri', 'Onitsha', 'Abeokuta', 'Jos', 'Ilorin', 'Owerri', 'Calabar', 'Uyo', 'Maiduguri', 'Zaria', 'Sokoto'] },
  { code: 'GH', name: 'Ghana', cities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Sunyani', 'Ho', 'Koforidua', 'Techiman', 'Tema', 'Sekondi', 'Obuasi', 'Ashaiman', 'Bolgatanga', 'Wa'] },
  { code: 'KE', name: 'Kenya', cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Nyeri', 'Meru', 'Machakos', 'Narok', 'Embu'] },
  { code: 'ZA', name: 'South Africa', cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Pietermaritzburg', 'Polokwane', 'Nelspruit', 'Kimberley', 'Rustenburg', 'Welkom', 'Potchefstroom', 'Upington'] },
  { code: 'UG', name: 'Uganda', cities: ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Mbale', 'Masaka', 'Entebbe', 'Arua', 'Soroti', 'Fort Portal', 'Kabale', 'Mukono', 'Tororo', 'Hoima'] },
  { code: 'TZ', name: 'Tanzania', cities: ['Dar es Salaam', 'Arusha', 'Mwanza', 'Dodoma', 'Zanzibar', 'Mbeya', 'Tanga', 'Morogoro', 'Tabora', 'Kigoma', 'Mtwara', 'Lindi', 'Musoma', 'Shinyanga', 'Bukoba'] },
  { code: 'RW', name: 'Rwanda', cities: ['Kigali', 'Butare', 'Gitarama', 'Ruhengeri', 'Gisenyi', 'Cyangugu', 'Byumba', 'Kibungo', 'Kibuye', 'Rwamagana'] },
  { code: 'ET', name: 'Ethiopia', cities: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Awassa', 'Bahir Dar', 'Dessie', 'Jimma', 'Harar', 'Jijiga', 'Shashamane', 'Nazret', 'Arba Minch', 'Gambela', 'Hawassa'] },
  { code: 'ZM', name: 'Zambia', cities: ['Lusaka', 'Kitwe', 'Ndola', 'Kabwe', 'Chingola', 'Mufulira', 'Livingstone', 'Kasama', 'Chipata', 'Solwezi', 'Mazabuka', 'Mongu', 'Choma', 'Kafue', 'Mpika'] },
  { code: 'ZW', name: 'Zimbabwe', cities: ['Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi', 'Bindura', 'Marondera', 'Gwanda', 'Zvishavane', 'Rusape', 'Beitbridge'] },
  { code: 'BW', name: 'Botswana', cities: ['Gaborone', 'Francistown', 'Molepolole', 'Serowe', 'Maun', 'Mogoditshane', 'Palapye', 'Selibe Phikwe', 'Mahalapye', 'Mochudi', 'Kanye', 'Ramotswa', 'Thamaga', 'Tlokweng', 'Jwaneng'] },
  { code: 'NA', name: 'Namibia', cities: ['Windhoek', 'Walvis Bay', 'Swakopmund', 'Oshakati', 'Rundu', 'Katima Mulilo', 'Grootfontein', 'Keetmanshoop', 'Rehoboth', 'Otjiwarongo', 'Okahandja', 'Omaruru', 'Lüderitz', 'Tsumeb', 'Gobabis'] },
  { code: 'CI', name: 'Côte d\'Ivoire', cities: ['Abidjan', 'Bouaké', 'Daloa', 'Yamoussoukro', 'San-Pédro', 'Korhogo', 'Man', 'Divo', 'Gagnoa', 'Abengourou', 'Grand-Bassam', 'Anyama', 'Agboville', 'Bingerville', 'Dabou'] },
  { code: 'SN', name: 'Senegal', cities: ['Dakar', 'Thiès', 'Rufisque', 'Kaolack', 'Ziguinchor', 'Saint-Louis', 'Touba', 'Mbour', 'Louga', 'Tambacounda', 'Richard Toll', 'Kolda', 'Mbacké', 'Fatick', 'Diourbel'] },
  { code: 'CM', name: 'Cameroon', cities: ['Douala', 'Yaoundé', 'Garoua', 'Bafoussam', 'Bamenda', 'Maroua', 'Buea', 'Kribi', 'Limbe', 'Ebolowa', 'Kousseri', 'Nkongsamba', 'Bafang', 'Foumban', 'Bertoua'] },
  { code: 'ML', name: 'Mali', cities: ['Bamako', 'Sikasso', 'Mopti', 'Koutiala', 'Kayes', 'Ségou', 'Gao', 'Tombouctou', 'Kidal', 'Ménaka', 'Taoudenni', 'Nioro', 'Kita', 'Bougouni', 'San'] },
  { code: 'AO', name: 'Angola', cities: ['Luanda', 'Huambo', 'Lobito', 'Benguela', 'Lubango', 'Kuito', 'Malanje', 'Namibe', 'Soyo', 'Cabinda', 'Uíge', 'Sumbe', 'Menongue', 'N\'dalatando', 'Mbanza Kongo'] },
  { code: 'DZ', name: 'Algeria', cities: ['Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif', 'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'Tiaret', 'Béjaïa', 'Tlemcen', 'Béchar'] },
  { code: 'MA', name: 'Morocco', cities: ['Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Tangier', 'Agadir', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Mohammedia', 'El Jadida', 'Nador', 'Beni Mellal'] },
  { code: 'TN', name: 'Tunisia', cities: ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Ariana', 'Gafsa', 'Monastir', 'Ben Arous', 'Medenine', 'Kasserine', 'Jendouba', 'Tozeur', 'Mahdia'] },
  { code: 'EG', name: 'Egypt', cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Aswan', 'Ismailia', 'Mansoura', 'Tanta', 'Asyut', 'Zagazig', 'Damietta', 'Minya'] },
  { code: 'SY', name: 'Syria', cities: ['Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama', 'Raqqa', 'Deir ez-Zor', 'Al-Hasakah', 'Qamishli', 'Tartus', 'Idlib', 'Daraa', 'As-Suwayda', 'Al-Bab', 'Manbij'] },
  
  // Caribbean
  { code: 'JM', name: 'Jamaica', cities: ['Kingston', 'Montego Bay', 'Spanish Town', 'Portmore', 'Mandeville', 'Ocho Rios', 'Negril', 'May Pen', 'Savanna-la-Mar', 'Old Harbour', 'Linstead', 'St. Ann\'s Bay', 'Falmouth', 'Port Antonio', 'Morant Bay'] },
  { code: 'TT', name: 'Trinidad and Tobago', cities: ['Port of Spain', 'San Fernando', 'Chaguanas', 'Arima', 'Couva', 'Point Fortin', 'Princes Town', 'Tunapuna', 'Scarborough', 'Sangre Grande', 'Rio Claro', 'Siparia', 'Penal', 'Debe', 'Marabella'] },
  { code: 'HT', name: 'Haiti', cities: ['Port-au-Prince', 'Cap-Haïtien', 'Gonaïves', 'Les Cayes', 'Jérémie', 'Port-de-Paix', 'Jacmel', 'Petionville', 'Delmas', 'Carrefour', 'Saint-Marc', 'Hinche', 'Miragoâne', 'Fort-Liberté', 'Trou-du-Nord'] },
  { code: 'BB', name: 'Barbados', cities: ['Bridgetown', 'Speightstown', 'Oistins', 'Holetown', 'The Crane', 'St. Lawrence', 'Worthing', 'Hastings'] },
  { code: 'GD', name: 'Grenada', cities: ['St. George\'s', 'Gouyave', 'Grenville', 'Victoria', 'Sauteurs', 'Hillsborough', 'Carriacou'] },
  { code: 'BS', name: 'Bahamas', cities: ['Nassau', 'Freeport', 'Marsh Harbour', 'George Town', 'Coopers Town', 'High Rock', 'Andros Town', 'Duncan Town'] },
  
  // Latin America
  { code: 'BR', name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre', 'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís'] },
  { code: 'MX', name: 'Mexico', cities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí', 'Mérida', 'Mexicali', 'Aguascalientes', 'Cuernavaca', 'Toluca'] },
  { code: 'AR', name: 'Argentina', cities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'Tucumán', 'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan', 'Resistencia', 'Santiago del Estero', 'Corrientes', 'Bahía Blanca', 'Posadas'] },
  { code: 'CO', name: 'Colombia', cities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Soledad', 'Ibagué', 'Bucaramanga', 'Santa Marta', 'Pereira', 'Villavicencio', 'Pasto', 'Manizales', 'Valledupar'] },
  { code: 'PE', name: 'Peru', cities: ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Iquitos', 'Cusco', 'Huancayo', 'Ica', 'Sullana', 'Chimbote', 'Pucallpa', 'Tacna', 'Juliaca', 'Ayacucho'] },
  { code: 'CL', name: 'Chile', cities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta', 'Temuco', 'Rancagua', 'Talca', 'Arica', 'Iquique', 'Puerto Montt', 'Los Angeles', 'Calama', 'Copiapó', 'Osorno'] },
  { code: 'VE', name: 'Venezuela', cities: ['Caracas', 'Maracaibo', 'Valencia', 'Barquisimeto', 'Maracay', 'Ciudad Guayana', 'Barcelona', 'Maturín', 'Ciudad Bolívar', 'San Cristóbal', 'Cumaná', 'Barinas', 'Mérida', 'Cabimas', 'Puerto La Cruz'] },
  { code: 'EC', name: 'Ecuador', cities: ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Machala', 'Durán', 'Manta', 'Portoviejo', 'Loja', 'Ambato', 'Esmeraldas', 'Quevedo', 'Riobamba', 'Milagro', 'Ibarra'] },
  { code: 'GT', name: 'Guatemala', cities: ['Guatemala City', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Escuintla', 'San Juan Sacatepéquez', 'Villa Canales', 'Petapa', 'Chinautla', 'Chimaltenango', 'Huehuetenango', 'Jutiapa', 'Cobán', 'Mazatenango', 'Retalhuleu'] },
  { code: 'DO', name: 'Dominican Republic', cities: ['Santo Domingo', 'Santiago', 'La Romana', 'San Pedro de Macorís', 'San Francisco de Macorís', 'Puerto Plata', 'Bavaro', 'Punta Cana', 'Baní', 'San Cristóbal', 'Moca', 'Azua', 'Barahona', 'Bonao', 'Higüey'] },
  
  // Asia (Global South)
  { code: 'IN', name: 'India', cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane'] },
  { code: 'PK', name: 'Pakistan', cities: ['Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Peshawar', 'Islamabad', 'Quetta', 'Sargodha', 'Sialkot', 'Bahawalpur', 'Sukkur', 'Larkana', 'Sheikhupura'] },
  { code: 'BD', name: 'Bangladesh', cities: ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Comilla', 'Barisal', 'Rangpur', 'Mymensingh', 'Jessore', 'Narayanganj', 'Gazipur', 'Bogra', 'Dinajpur', 'Cox\'s Bazar'] },
  { code: 'PH', name: 'Philippines', cities: ['Manila', 'Quezon City', 'Caloocan', 'Davao', 'Cebu', 'Zamboanga', 'Antipolo', 'Pasig', 'Taguig', 'Makati', 'Bacolod', 'General Santos', 'Parañaque', 'Las Piñas', 'Valenzuela'] },
  { code: 'VN', name: 'Vietnam', cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Haiphong', 'Can Tho', 'Bien Hoa', 'Hue', 'Nha Trang', 'Vung Tau', 'Quy Nhon', 'Rach Gia', 'Long Xuyen', 'My Tho', 'Cam Ranh', 'Bac Lieu'] },
  { code: 'TH', name: 'Thailand', cities: ['Bangkok', 'Nonthaburi', 'Nakhon Ratchasima', 'Chiang Mai', 'Hat Yai', 'Udon Thani', 'Pak Kret', 'Khon Kaen', 'Nakhon Si Thammarat', 'Phitsanulok', 'Chon Buri', 'Songkhla', 'Nakhon Pathom', 'Rayong', 'Lampang'] },
  { code: 'ID', name: 'Indonesia', cities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Palembang', 'Makassar', 'Tangerang', 'Depok', 'Bekasi', 'Padang', 'Bandar Lampung', 'Denpasar', 'Malang', 'Yogyakarta'] },
  { code: 'MY', name: 'Malaysia', cities: ['Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Johor Bahru', 'Malacca City', 'Kota Kinabalu', 'Kuching', 'Kota Bharu', 'Alor Setar', 'Miri', 'Seremban', 'Subang Jaya', 'Klang'] },
  
  // Middle East (Global South)
  { code: 'IQ', name: 'Iraq', cities: ['Baghdad', 'Basra', 'Mosul', 'Erbil', 'Najaf', 'Karbala', 'Sulaymaniyah', 'Kirkuk'] },
  { code: 'YE', name: 'Yemen', cities: ['Sana\'a', 'Aden', 'Taiz', 'Al Hudaydah', 'Ibb', 'Dhamar', 'Al Mukalla', 'Sayyan'] },
  { code: 'JO', name: 'Jordan', cities: ['Amman', 'Zarqa', 'Irbid', 'Russeifa', 'Wadi Al-Sir', 'Aqaba', 'Madaba', 'Salt'] },
  { code: 'LB', name: 'Lebanon', cities: ['Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Nabatieh', 'Jounieh', 'Zahle', 'Baalbek'] },
  { code: 'PS', name: 'Palestine', cities: ['Gaza', 'Hebron', 'Nablus', 'Ramallah', 'Jericho', 'Bethlehem', 'Jenin', 'Tulkarm'] },
  
  // Oceania (Global South)
  { code: 'FJ', name: 'Fiji', cities: ['Suva', 'Lautoka', 'Nadi', 'Labasa', 'Ba', 'Levuka', 'Sigatoka', 'Nausori'] },
  { code: 'PG', name: 'Papua New Guinea', cities: ['Port Moresby', 'Lae', 'Arawa', 'Mount Hagen', 'Popondetta', 'Madang', 'Kokopo', 'Goroka'] },
].sort((a, b) => a.name.localeCompare(b.name));

// Diaspora Countries (Outside Global South)
export const diasporaCountries = [
  { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Fort Worth', 'Charlotte', 'Seattle', 'Denver', 'Washington', 'Boston'] },
  { code: 'GB', name: 'United Kingdom', cities: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Edinburgh', 'Sheffield', 'Bristol', 'Cardiff', 'Belfast', 'Leicester', 'Coventry', 'Nottingham', 'Newcastle', 'Southampton', 'Portsmouth', 'Reading', 'Northampton', 'Luton'] },
  { code: 'CA', name: 'Canada', cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener', 'London', 'Victoria', 'Halifax', 'Oshawa', 'Windsor', 'Saskatoon', 'Regina', 'Sherbrooke', 'Kelowna', 'Barrie'] },
  { code: 'FR', name: 'France', cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne'] },
  { code: 'DE', name: 'Germany', cities: ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nuremberg', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster'] },
  { code: 'NL', name: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen', 'Enschede', 'Haarlem', 'Arnhem', 'Zaanstad', 'Amersfoort', 'Apeldoorn', 'Hoofddorp', 'Maastricht', 'Leiden', 'Dordrecht'] },
  { code: 'SE', name: 'Sweden', cities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping', 'Lund', 'Umeå', 'Gävle', 'Borås', 'Södertälje', 'Eskilstuna', 'Karlstad', 'Halmstad', 'Växjö', 'Sundsvall'] },
  { code: 'NO', name: 'Norway', cities: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger', 'Bærum', 'Kristiansand', 'Fredrikstad', 'Tromsø', 'Sandnes', 'Asker', 'Skien', 'Drammen', 'Sarpsborg', 'Bodø', 'Ålesund', 'Arendal', 'Haugesund', 'Tønsberg', 'Moss', 'Porsgrunn'] },
  { code: 'DK', name: 'Denmark', cities: ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde', 'Herning', 'Helsingør', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg', 'Køge', 'Holstebro', 'Taastrup', 'Sønderborg'] },
  { code: 'FI', name: 'Finland', cities: ['Helsinki', 'Espoo', 'Tampere', 'Vantaa', 'Oulu', 'Turku', 'Jyväskylä', 'Lahti', 'Kuopio', 'Pori', 'Kouvola', 'Joensuu', 'Lappeenranta', 'Hämeenlinna', 'Vaasa', 'Seinäjoki', 'Rovaniemi', 'Mikkeli', 'Kotka', 'Salo'] },
  { code: 'IE', name: 'Ireland', cities: ['Dublin', 'Cork', 'Limerick', 'Galway', 'Waterford', 'Drogheda', 'Dundalk', 'Swords', 'Bray', 'Navan', 'Ennis', 'Kilkenny', 'Carlow', 'Tralee', 'Newbridge', 'Naas', 'Athlone', 'Portlaoise', 'Mullingar', 'Celbridge'] },
  { code: 'ES', name: 'Spain', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao', 'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Hospitalet', 'Granada', 'Vitoria-Gasteiz', 'A Coruña', 'Elche'] },
  { code: 'PT', name: 'Portugal', cities: ['Lisbon', 'Porto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Funchal', 'Coimbra', 'Setúbal', 'Almada', 'Agualva-Cacém', 'Queluz', 'Rio de Mouro', 'Barreiro', 'Aveiro', 'Corroios', 'Leiria', 'Faro', 'Évora', 'Portimão', 'Viseu'] },
  { code: 'IT', name: 'Italy', cities: ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Bari', 'Catania', 'Venice', 'Verona', 'Messina', 'Padua', 'Trieste', 'Brescia', 'Parma', 'Taranto', 'Modena', 'Reggio Calabria'] },
  { code: 'CH', name: 'Switzerland', cities: ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 'St. Gallen', 'Lucerne', 'Lugano', 'Biel', 'Thun', 'Köniz', 'La Chaux-de-Fonds', 'Schaffhausen', 'Fribourg', 'Chur', 'Neuchâtel', 'Vernier', 'Uster', 'Sion'] },
  { code: 'BE', name: 'Belgium', cities: ['Brussels', 'Antwerp', 'Ghent', 'Charleroi', 'Liège', 'Bruges', 'Namur', 'Leuven', 'Mons', 'Aalst', 'Mechelen', 'La Louvière', 'Hasselt', 'Kortrijk', 'Sint-Niklaas', 'Ostend', 'Tournai', 'Genk', 'Seraing', 'Roeselare'] },
  { code: 'AT', name: 'Austria', cities: ['Vienna', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt', 'Villach', 'Wels', 'Sankt Pölten', 'Dornbirn', 'Steyr', 'Wiener Neustadt', 'Feldkirch', 'Bregenz', 'Leonding', 'Klosterneuburg', 'Baden', 'Wolfsberg', 'Leoben', 'Krems'] },
  { code: 'AU', name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong', 'Hobart', 'Geelong', 'Townsville', 'Cairns', 'Toowoomba', 'Darwin', 'Ballarat', 'Bendigo', 'Albury', 'Launceston'] },
  { code: 'NZ', name: 'New Zealand', cities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Napier', 'Palmerston North', 'Dunedin', 'Rotorua', 'New Plymouth', 'Whangarei', 'Invercargill', 'Nelson', 'Hastings', 'Gisborne', 'Timaru', 'Blenheim', 'Taupo', 'Pukekohe', 'Masterton'] },
  { code: 'AE', name: 'United Arab Emirates', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Khor Fakkan', 'Kalba'] },
  { code: 'QA', name: 'Qatar', cities: ['Doha', 'Al Rayyan', 'Umm Salal', 'Al Wakrah', 'Al Khor', 'Dukhan', 'Mesaieed', 'Al Shamal', 'Al Daayen', 'Al Sheehaniya'] },
  { code: 'SA', name: 'Saudi Arabia', cities: ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Taif', 'Abha', 'Tabuk', 'Buraydah', 'Khamis Mushait', 'Hail', 'Najran', 'Al Jubail', 'Yanbu', 'Al Kharj', 'Arar', 'Sakaka', 'Jizan', 'Dhahran'] },
  { code: 'CN', name: 'China', cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Xi\'an', 'Nanjing', 'Tianjin', 'Suzhou', 'Dongguan', 'Chongqing', 'Foshan', 'Shenyang', 'Qingdao', 'Zhengzhou', 'Changsha', 'Kunming', 'Dalian'] },
  { code: 'JP', name: 'Japan', cities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki', 'Kyoto', 'Saitama', 'Hiroshima', 'Sendai', 'Chiba', 'Kitakyushu', 'Sakai', 'Niigata', 'Hamamatsu', 'Shizuoka', 'Sagamihara', 'Okayama'] },
  { code: 'KR', name: 'South Korea', cities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Goyang', 'Seongnam', 'Bucheon', 'Ansan', 'Anyang', 'Jeonju', 'Cheonan', 'Namyangju', 'Hwaseong', 'Gimhae', 'Pyeongtaek'] },
  { code: 'SG', name: 'Singapore', cities: ['Singapore', 'Jurong West', 'Tampines', 'Woodlands', 'Yishun', 'Ang Mo Kio', 'Hougang', 'Sengkang', 'Punggol', 'Pasir Ris', 'Choa Chu Kang', 'Bukit Batok', 'Bukit Panjang', 'Toa Payoh', 'Bishan', 'Serangoon', 'Clementi', 'Queenstown', 'Marine Parade', 'Bedok'] },
].sort((a, b) => a.name.localeCompare(b.name));
