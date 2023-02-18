import type { RequestHandler } from "./$types";
import Stripe from 'stripe';

const SECRET_STRIPE_KEY = "sk_test_51LfAvvGEQ8u28rQ5IvVpV2iXwMEIRvDvMNLTyzfM6eXlxQZpLlyrXFjiRP0Nj64t7EDcXm3tnDxnEvShrmCwUDgW00TaZN1cO8";
const stripe = new Stripe(SECRET_STRIPE_KEY, {
    apiVersion: "2022-11-15"
});

// localhost:5173/api/stripeCheckout

// POST /stripeCheckout data: items
// return -> url created by Stripe for our user to use

export const POST: RequestHandler = async ({request}) => {
    // items: [ { id: "1", quantity: 6 }, { id: "2", quantity: 3 } ]
    const data = await request.json();
    const items = data.items;
    console.log(items);
    /*
        we have: [ { id: "1", quantity: 6 }, { id: "2", quantity: 3 } ]
        stripe wants: [ { price: "1", quantity: 6 }, { price: "2", quantity: 3 } ]
    */

    let lineItems : any = [];
    items.forEach((item: any) => {
        lineItems.push( { price: item.id, quantity: item.quantity } )
    });

    // It gives us a URL for the person to check out with
    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
    });

    return new Response(
        JSON.stringify({ url: session.url }), // frontend will get this url to redirect
        {
            status: 200,
            headers: { 'content-type': 'application/json'}
        }
    )
}