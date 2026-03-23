using UnityEngine;

public class LookAtCandidate : MonoBehaviour
{
    public Transform target;
    public float rotationSpeed = 2f;

    void Update()
    {
        if (target == null) return;

        Vector3 direction = target.position - transform.position;
        Quaternion lookRotation = Quaternion.LookRotation(direction);

        transform.rotation = Quaternion.Slerp(
            transform.rotation,
            lookRotation,
            Time.deltaTime * rotationSpeed
        );
    }
}