import { Request, Response, response } from 'express';
import { getRepository } from 'typeorm';
import { getConnection } from 'typeorm';

import { SuperOrder } from '../entity/SuperOrder';

class SuperOrdersController {
	static search = async (req: Request, res: Response) => {
		const superOrderRepository = getRepository(SuperOrder);

		// let terms=req.query.terms;
		// let sort=req.query.sort;
		// let tags=req.query.tags;
		// let location=req.query.location;
		// let nResults=req.query.nResults;
		// let user=req.query.nResults;

		let superOrders;
		try {
			superOrders = await superOrderRepository.find({ take: 10 });
		} catch (e) {
			res.status(404).send('not found');
		}
		console.log(superOrders);
		res.json(superOrders);
	};
}

export default SuperOrdersController;
