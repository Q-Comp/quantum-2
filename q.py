#! /usr/bin/env python
import sys
import json, ast
import logging
logging.basicConfig()
# pylint: disable=W0403

qasm = sys.stdin.read()

sys.path.append('IBMQuantumExperience')
sys.path.append('../IBMQuantumExperience')
# pylint: disable=C0413
try:
    if sys.version_info.major > 2:  # Python 3
        from IBMQuantumExperience.IBMQuantumExperience import IBMQuantumExperience  # noqa
    else:  # Python 2
        from IBMQuantumExperience import IBMQuantumExperience  # noqa
    from IBMQuantumExperience.IBMQuantumExperience import ApiError
    from IBMQuantumExperience.IBMQuantumExperience import BadBackendError  # noq
except:
    sys.stderr.write("IBMQuantumExperience library not installed. Use : pip install IBMQuantumExperience")
    sys.exit(0)

api = IBMQuantumExperience(sys.argv[1])
# my_credits = api.get_my_credits()
# print "Credits: ", ast.literal_eval(json.dumps(my_credits))
# print "Backend: ",api.available_backend_simulators()[0]['name']

# qasm = 'OPENQASM 2.0;\n\ninclude "qelib1.inc";\nqreg q[5];\ncreg c[5];\nh q[0];\ncx q[0],q[2];\nmeasure q[0] -> c[0];\nmeasure q[2] -> c[1];\n'
# qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[5];\ncreg c[5];\nh q[0];\nx q[1];\ncx q[0],q[1];\nmeasure q[0] -> c[0];\nmeasure q[1] -> c[1];'
# print "qasm: ",qasm

backend = api.available_backend_simulators()[0]['name']
shots = sys.argv[2]
experiment = api.run_experiment(qasm, backend, shots)
print ast.literal_eval(json.dumps(experiment))
