import { makeStyles } from '@material-ui/core/styles';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import React from 'react';
import * as XLSX from 'xlsx';

import { ConnectMetamask } from '../../components/ConnectMetamask';
import { Footer } from '../../components/Footer';
import { AdminDashboardHeader } from '../../components/AdminDashboardHeader';
import styles from '../../styles/Dashboard.module.css';

const useStyles = makeStyles(() => ({
	searchIcon: {
		verticalAlign: 'middle'
	}
}));

export default function Dashboard() {
	const classes = useStyles();
	const [ethAddress, setEthAddress] = useState('');
	const [connectionText, setConnectionText] = useState('');
	const [joinedIdos, setJoinedIdos] = useState([]);
	const [data, setData] = useState([]);
	const [whitelist, setWhitelist] = useState([]);
	const [amount, setAmount] = useState(0);
	const [isGenerated, setIsGenerated] = useState(false);

	useEffect(async () => {

	}, []);

	const handleFileUpload = e => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (evt) => {
			/* Parse data */
			const bstr = evt.target.result;
			const wb = XLSX.read(bstr, { type: 'binary' });
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
			processData(data);
		};
		reader.readAsBinaryString(file);
		setIsGenerated(false);
	}

	const processData = dataString => {
		const dataStringLines = dataString.split(/\r\n|\n/);
		const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

		const list = [];
		for (let i = 1; i < dataStringLines.length; i++) {
			const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
			if (headers && row.length == headers.length) {
				const obj = {};
				for (let j = 0; j < headers.length; j++) {
					let d = row[j];
					if (d.length > 0) {
						if (d[0] == '"')
							d = d.substring(1, d.length - 1);
						if (d[d.length - 1] == '"')
							d = d.substring(d.length - 2, 1);
					}
					if (headers[j]) {
						obj[headers[j]] = d;
					}
				}

				// remove the blank rows
				if (Object.values(obj).filter(x => x).length > 0) {
					list.push(obj);
				}
			}
		}

		// prepare columns list from headers
		const columns = headers.map(c => ({
			name: c,
			selector: c,
		}));

		setData(list);
		console.log(list, 'list')
	}

	const generate = () => {
		let resultArray = [];
		let count = 0;
		let tempObject = {};
		let randomInt = 0;
		for (let i = 0; i < data.length; i++) {
			if (resultArray.length === amount)
				break;
			if (parseInt(data[i].Balance) >= 10000)
				resultArray.push(data[i]);
			if (parseInt(data[i].Balance) >= 100) {
				tempObject[count + "-" + (count + parseInt(parseInt(data[i].Balance) / 100))] = data[i];
				count = count + parseInt(parseInt(data[i].Balance) / 100);
			}
		}
		while (resultArray.length < amount) {
			randomInt = Math.floor(Math.random() * count);
			for (let i = 0; i < Object.keys(tempObject).length; i++) {
				if (resultArray.length === amount)
					break;
				if (parseInt(Object.keys(tempObject)[i].split("-")[0]) <= randomInt && parseInt(Object.keys(tempObject)[i].split("-")[1]) >= randomInt) {
					resultArray.push(Object.values(tempObject)[i]);
				}
			}
		}
		setWhitelist([...resultArray])
		setIsGenerated(true);
	}

	const save = () => {
		let address = [];
		for (let i=0;i<whitelist.length;i++){
			address.push(whitelist[i].HolderAddress);
		}
		const token = Cookies.get('access_token');
		const headers = {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`
		};
		axios({
			method: 'post',
			url: `${process.env.NEXT_PUBLIC_FORWARDER_ORIGIN}/api/addWhitelist`,
			headers,
			data: address.join(",")
		})
			.then(response => {
				console.log(response)
			})
			.catch(error => {
				console.log(error)
			});
	}

	return (
		<div className={styles.container}>
			<Head>
				<title>Crypto Excellence</title>
				<meta name="description" content="Crypto Excellence" />
				<link rel="icon" href="/cefavicon.png" />
			</Head>
			<video
				playsInline
				autoPlay
				muted
				loop
				id="bgvid"
				className={styles.video}
			>
				<source src="/bgvideo.mp4" type="video/mp4" />
			</video>
			<AdminDashboardHeader
				ethAddress={ethAddress}
				setEthAddress={setEthAddress}
				setConnectionText={setConnectionText}
			/>
			<main className={styles.main}>
				{ethAddress === '' ? (
					<section className={styles.wrapper}>
						<ConnectMetamask
							ethAddress={ethAddress}
							setEthAddress={setEthAddress}
							connectionText={connectionText}
							setConnectionText={setConnectionText}
						/>
					</section>
				) : (
					<div className={styles.dashboardContainer}>
						<div className={styles.buttonWrapper}>
							<input type="number" className={styles.input} value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
							<button className={styles.button} onClick={generate}>Generate</button>
							<button className={styles.button} onClick={save}>Save</button>
							<input
								type="file"
								accept=".csv,.xlsx,.xls"
								onChange={handleFileUpload}
							/>
						</div>
						<div className={styles.tableContainer}>
							<table>
								<thead>
									<tr
										style={{
											borderBottom:
												joinedIdos.length > 0 ? '1px solid #018a44' : 'none'
										}}
									>
										<th>Holder Address</th>
										<th>Token Amount</th>
									</tr>
								</thead>
								<tbody>
									{isGenerated && whitelist.map((item, index) => (
										<tr key={index}>
											<td>{item.HolderAddress}</td>
											<td>{item.Balance}</td>
										</tr>
									))}
									{!isGenerated && data.map((item, index) => (
										<tr key={index}>
											<td>{item.HolderAddress}</td>
											<td>{item.Balance}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</main>
			<Footer />
		</div>
	);
}
