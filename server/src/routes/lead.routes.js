const router = require('express').Router();
const ctrl = require('../controllers/lead.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/lead.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('lead:create'), validate(schema.createLead), ctrl.createLead);
router.get('/', authenticate, authorize('lead:read'), ctrl.getLeads);

// Static routes must come before /:id to avoid being caught by the param route
router.get('/stats', authenticate, authorize('lead:view-stats'), ctrl.getLeadStats);
router.get('/export', authenticate, authorize('lead:export'), ctrl.exportLeads);
router.post('/bulk', authenticate, authorize('lead:manage'), validate(schema.bulkAction), ctrl.bulkAction);

router.get('/:id', authenticate, authorize('lead:read'), ctrl.getLeadById);
router.patch('/:id', authenticate, authorize('lead:update'), validate(schema.updateLead), ctrl.updateLead);
router.delete('/:id', authenticate, authorize('lead:delete'), ctrl.deleteLead);
router.patch('/:id/status', authenticate, authorize('lead:manage'), validate(schema.changeStatus), ctrl.changeStatus);
router.patch('/:id/assign', authenticate, authorize('lead:assign'), validate(schema.assignLead), ctrl.assignLead);
router.post('/:id/notes', authenticate, authorize('lead:update'), validate(schema.addNote), ctrl.addNote);

module.exports = router;
