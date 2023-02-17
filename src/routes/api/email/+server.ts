import PocketBase from 'pocketbase';
import { json } from '@sveltejs/kit';
import sgMail from '@sendgrid/mail';
import {
	SENDGRID_API_KEY,
	POCKETBASE_ADMIN_EMAIL,
	POCKETBASE_ADMIN_PWD
} from '$env/static/private';
import { dev } from '$app/environment';
import { pb } from '$lib/glue/pocketbase';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { senderName, receiverId, content } = await request.json();

	sgMail.setApiKey(SENDGRID_API_KEY);

	try {
		// TODO: generalize email parameters to app config file
		const pbAdmin = new PocketBase('https://glue2-ridehub.fly.dev/');
		await pbAdmin.admins.authWithPassword(POCKETBASE_ADMIN_EMAIL, POCKETBASE_ADMIN_PWD);
		await pbAdmin.collection('users').update(receiverId, {
			emailVisibility: true
		});

		const targetUser = await pb.collection('users').getOne(receiverId);

		await pbAdmin.collection('users').update(receiverId, {
			emailVisibility: false
		});

		const devHtml = `<div>Intended recipent: ${targetUser?.email}</div>`;
		const to = dev ? 'jj534@cornell.edu' : targetUser?.email;
		const url = 'https://ride.hubcornell.com/chatrooms';
		const html = `
    <div>
      ${dev ? devHtml : '<div></div>'}
      <div>
        ${senderName} sent you a message!
      </div>
      <br />
      <div>
        "${content}"
      </div>
      <br />
      <div style="font-weight:bold;">
        Reply to ${senderName} at <a href="${url}">${url}</a>
      </div>
      <br /><br />
      <div>
        THIS IS A COMPUTER GENERATED EMAIL. PLEASE DO NOT REPLY DIRECTLY TO THIS EMAIL.
      </div>
      <div style="color:white;">
        Tag: ${Math.random()}
      </div>
    </div>
  `;

		await sgMail.send({
			to,
			from: 'ridehub.webdev@gmail.com',
			subject: `[RideHub] ${senderName} sent you a message!`,
			html
		});

		return json({
			isSent: true
		});
	} catch (error) {
		if (error?.status !== 404) {
			pb.collection('logs').create({
				variant: 'email-fail',
				context: {
					receiverId,
					content
				}
			});
		}
		return json({
			isSent: false
		});
	}
}
