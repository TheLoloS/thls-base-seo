const kill = require('tree-kill');
const ks = require('node-key-sender');
// get current path
const path = require('path');
const { spawn } = require('node:child_process'); 
const config = require('./config.json');
// get time from config
const time = config.closeTime;

// Tablica z ścieżkami do programów
const programs = [
	".\\sub_programs\\thls-seo.exe",
	".\\sub_programs\\thls-seoWU.exe",
	".\\sub_programs\\thls-seo-frazy-urban.exe",
	".\\sub_programs\\thls-seo-frazy-urbanWU.exe",
];
const vpn = path.join(process.cwd(),"vpn","Vpn.exe");

// Uruchomienie VPN
function Main() {
	try {
		
	
	console.log("Uruchamianie VPN...");
	// Uruchomienie programu VPN
	console.log(vpn);
	const vpnProcess = spawn('cmd.exe', ['/c', vpn]);
	vpnProcess.stdout.on('data', (data) => { 
		console.log(data.toString()); 
	});
	vpnProcess.stderr.on('data', (data) => { 
		console.error(data.toString()); 
	});
	vpnProcess.on('exit', (code) => { 
		console.log(`Child exited with code ${code}`); 
	});
	setTimeout(() => {
		setTimeout(() => {
			ks.sendKey('tab');
		}, 1000);
		setTimeout(() => {
			ks.sendKey('tab');
		}, 1500);
		setTimeout(() => {
			ks.sendKey('tab');
		}, 2000);
		setTimeout(() => {
			ks.sendKey('tab');
		}, 2500);
		setTimeout(() => {
				ks.sendKey('enter');
		}, 3000);
	}, 2000);
	
// Uruchomienie pierwszego programu
setTimeout(() => {
runProgram();
}, 6000);
} catch (error) {
console.log(error);
		
}

} 

function runProgram() {
	console.log("Uruchamianie programu...");
	// Wylosuj indeks programu do uruchomienia
	const index = Math.floor(Math.random() * programs.length);
	console.log(`Wylosowano program ${index + 1} z ${programs.length}`);
console.log(path.join(process.cwd(),programs[index]))
	// Uruchomienie programu
	const exe = spawn('cmd.exe', ['/c', path.join(process.cwd(),programs[index])]); 
	// get pid of program
	const pid = exe.pid;
 
	exe.stdout.on('data', (data) => { 
	  console.log(data.toString()); 
	}); 
	 
	exe.stderr.on('data', (data) => { 
	  console.error(data.toString()); 
	}); 
	 
	exe.on('exit', (code) => { 
	  console.log(`Child exited with code ${code}`); 
	}); 

	

	// Oczekiwanie 20 minut przed ewentualnym zakończeniem programu
	setTimeout(() => {
			console.log(
				`Przekroczenie czasu dla programu ${index + 1}. Zatrzymywanie...`,
			);
			kill(pid, 'SIGKILL', function(err) {
				runProgram();
			});
	}, time); // 20 minut w milisekundach
}

// Uruchomienie programu
Main();