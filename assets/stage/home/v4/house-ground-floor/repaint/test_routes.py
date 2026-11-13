"""The clearance audit must reject a 95px gap and accept a 96px gap."""
import unittest
from room_mockups import routes
class ClearanceTests(unittest.TestCase):
 def test_exact_96px_corridor(self):
  report=routes((192,240),[{'footprints':[[0,0,48,240],[144,0,48,240]]}])
  self.assertTrue(report['passed'])
  self.assertEqual(report['components'][0]['edges'],['north','south'])
 def test_95px_corridor_fails(self):
  report=routes((192,240),[{'footprints':[[0,0,49,240],[144,0,48,240]]}])
  self.assertFalse(report['passed'])
 def test_dead_end_pocket_fails(self):
  report=routes((192,240),[{'footprints':[[0,0,48,240],[144,0,48,240],[0,180,192,60]]}])
  self.assertFalse(report['passed'])
if __name__=='__main__':unittest.main()
